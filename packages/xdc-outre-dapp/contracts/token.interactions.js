import { stableToken } from '@dapp/config/appconfig';
import tokenAbi from '@dapp/config/abis/token.abi.json';
import { Contract, utils } from 'ethers';
import { getSigner } from '@dapp/config/signer';

let cachedContract = null;

const handleTransaction = async (transaction) => {
  try {
    const signer = getSigner();
    const contract = cachedContract || new Contract(stableToken, tokenAbi, signer);
    cachedContract = contract;
    const result = await transaction(contract);
    return result;
  } catch (error) {
    return error;
  }
};

export const approveFunds = async (spender, amount) => {
  const amountInWei = utils.parseUnits(amount, 6);
  const results = await handleTransaction(
    async (contract) => await contract.approve(spender, amountInWei),
  );
  return results;
};

export const tranferFunds = async (to, amount) => {
  const amountInWei = utils.parseUnits(amount, 6);
  const results = await handleTransaction(
    async (contract) => await contract.transfer(to, amountInWei),
  );
  const txReceipt = await results.wait();
  return {
    txHash: txReceipt.transactionHash,
    status: txReceipt.status,
  };
};

export const tranferNativeToken = async (to, amount) => {
  const amountInWei = utils.parseUnits(amount, 18);
  const wallet = getSigner();
  const results = await wallet.sendTransaction({
    to,
    value: amountInWei,
    data: '0x',
  });
  const txReceipt = await results.wait();
  return {
    txHash: txReceipt.transactionHash,
    status: txReceipt.status,
  };
};

export const getTokenBalance = async (address) => {
  const balance = await handleTransaction(async (contract) => await contract.balanceOf(address));
  return utils.formatUnits(balance, 6);
};
