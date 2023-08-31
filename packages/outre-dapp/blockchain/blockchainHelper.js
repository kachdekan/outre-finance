import { Wallet, utils } from 'ethers';
import { getProvider } from './provider';
import { DERIVATION_PATH } from '@dapp/consts';
import { config } from './config';
import { setSigner, getSigner } from './signer';
import { getContractByAddress, getContract, getCustomContract } from './contracts';
import { sendTransaction, getCurrentNonce } from './transaction';
import axios from 'axios';

export const setAppSigner = async (privateKey) => {
  const provider = getProvider();
  //const wallet = Wallet.fromMnemonic(mnemonic, CELO_DERIVATION_PATH)
  const signer = new Wallet(privateKey, provider);
  //const signer = new CeloWallet(wallet, provider);
  //console.log('Signer', signer);
  setSigner(signer);
};

export const createWallet = async (derivationPath) => {
  const path = derivationPath || DERIVATION_PATH;
  const entropy = utils.randomBytes(32);
  const mnemonic = utils.entropyToMnemonic(entropy);
  const wallet = Wallet.fromMnemonic(mnemonic, path);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  };
};

export const generateWalletFromMnemonic = async (mnemonic, derivationPath) => {
  const path = derivationPath || DERIVATION_PATH;
  const wallet = Wallet.fromMnemonic(mnemonic, path);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  };
};

export const getBalances = async (address, tokenMap) => {
  const tokenAddrs = Object.keys(tokenMap);
  // TODO may be good to batch here if token list is really long
  const fetchPromises = [];
  for (const tokenAddr of tokenAddrs) {
    //console.log(`Fetching ${tokenAddr} balance`);
    if (tokenAddr === config.contractAddresses.GoldToken) {
      fetchPromises.push(getNativeBalance(address));
    } else {
      fetchPromises.push(getTokenBalance(address, tokenAddr));
    }
  }

  const newTokenAddrToValue = {};
  const tokenBalancesArr = await Promise.all(fetchPromises);
  tokenBalancesArr.forEach((bal) => (newTokenAddrToValue[bal.tokenAddress] = bal.value));
  return newTokenAddrToValue;
};

// TODO Figure out why the balanceOf result is incorrect for MaticToken
// Contractkit works around this in the same way, must be a low-level issue
const getNativeBalance = async (address) => {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return {
    tokenAddress: config.contractAddresses.GoldToken,
    value: utils.formatUnits(balance, 18),
  };
};

export const getTokenBalance = async (address, tokenAddress) => {
  let contract;
  contract = getContractByAddress(tokenAddress);
  if (!contract) throw new Error(`No contract found for token: ${tokenAddress}`);
  const decimals = await contract.decimals();
  const balance = await contract.balanceOf(address);
  return { tokenAddress, value: utils.formatUnits(balance, decimals) };
};

export const transfer = async (contractName, args) => {
  const contract = getContract(contractName);
  const currentNonce = await getCurrentNonce();
  const gasPrice = utils.parseUnits('0.25', 'gwei').toString();
  const wallet = getSigner();
  if (!contract) throw new Error(`No contract found for name: ${contractName}`);
  try {
    let txReceipt;

    if (contract) {
      const decimals = await contract.decimals();
      const estimatedGas = await contract.estimateGas.transfer(
        args.recipientAddress,
        utils.parseUnits(args.amount.toString(), decimals),
      );

      const txResponse = await contract.transfer(
        args.recipientAddress,
        utils.parseUnits(args.amount.toString(), decimals),
        {
          gasPrice: args.gasPrice ? utils.parseUnits(args.gasPrice.toString(), 'gwei') : gasPrice,
          nonce: args.nonce || currentNonce,
          gasLimit: args.gasLimit || estimatedGas,
        },
      );
      txReceipt = await txResponse.wait();
    } else {
      const txResponse = await wallet.sendTransaction({
        to: args.recipientAddress,
        value: utils.parseEther(args.amount.toString()),
        gasPrice: args.gasPrice ? utils.parseUnits(args.gasPrice.toString(), 'gwei') : gasPrice,
        nonce: args.nonce || currentNonce,
        data: args.data ? utils.hexlify(utils.toUtf8Bytes(args.data)) : '0x',
      });
      txReceipt = await txResponse.wait();
    }

    return txReceipt;
  } catch (error) {
    throw error;
  }
};

export const smartContractCall = async (contractName, args) => {
  let contract = null;
  const currentNonce = await getCurrentNonce();
  if (args.contractAddress) {
    contract = getCustomContract(contractName, args.contractAddress);
  } else {
    contract = getContract(contractName);
  }

  //const nonce = await signer.getTransactionCount('pending')
  if (!contract) throw new Error(`No contract found for name: ${contractName}`);
  try {
    let txReceipt;
    let unsignedTx;
    let overrides = {};
    const provider = getProvider();
    const minGasPrice = await provider.getGasPrice();
    const feeEstimate = {
      gasPrice: minGasPrice, //utils.parseUnits('0.1', 'gwei').toString(),
      gasLimit: utils.parseUnits('0.035', 'gwei').toString(),
      fee: '0.0',
      feeToken: config.contractAddresses.StableToken,
    };

    if (args.methodType === 'read') {
      overrides = {};
    } else if (args.methodType === 'write') {
      const { gasPrice, gasLimit } = feeEstimate;
      overrides = {
        gasPrice,
        gasLimit,
        nonce: args.nonce ? args.nonce : currentNonce,
        value: args.value ? utils.parseEther(args.value.toString()) : 0,
      };
    }

    if (args.params) {
      if (args.approvalContract) {
        const approvalContract = getContract(args.approvalContract);
        await approvalContract.approve(args.contractAddress, args.params[0]);
      }
      unsignedTx = await contract.populateTransaction[args.method](
        ...args.params,
        args.approvalContract ? { ...overrides, nonce: currentNonce + 1 } : overrides,
      );
      txReceipt = await sendTransaction(unsignedTx, feeEstimate);
    } else {
      txReceipt = await contract?.[args.method](overrides);
    }

    return txReceipt;
  } catch (error) {
    throw error;
  }
};
