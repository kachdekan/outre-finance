import { tronWeb, stableToken } from '@dapp/config';
import tokenAbi from '@dapp/config/abis/token.abi.json';
import { utils } from 'ethers';
import { LoansData } from '../data';

const handleTransaction = async (transaction) => {
  try {
    const contract = await tronWeb.contract(tokenAbi, stableToken);
    const result = await transaction(contract);
    return result;
  } catch (error) {
    return error;
  }
};

export const approveFunds = async (spender, amount) => {
  const amountInWei = utils.parseUnits(amount, 18);
  const results = await handleTransaction(
    async (contract) => await contract.approve(spender, amountInWei).send(),
  );
  return results;
};

export const tranferFunds = async (to, amount) => {
  const amountInWei = utils.parseUnits(amount, 18);
  const results = await handleTransaction(
    async (contract) => await contract.transfer(to, amountInWei).send(),
  );
  return results;
};

export const tranferTRX = async (to, amount) => {
  console.log('tranferTRX', to, amount);
  const amountInSun = tronWeb.toSun(amount);
  const hexAddress = tronWeb.address.toHex(to);
  const results = await tronWeb.trx.sendTransaction(hexAddress, amountInSun);
  return results;
};

export const getUSDDBalance = async (address) => {
  const balance = await handleTransaction(
    async (contract) => await contract.balanceOf(address).call(),
  );
  return utils.formatUnits(balance, 18);
};
