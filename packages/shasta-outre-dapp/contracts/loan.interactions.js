import { tronWeb } from '@dapp/config';
import loanAbi from '@dapp/config/abis/P2PLoan.abi.json';
import { utils } from 'ethers';
import { LoansData } from '../data';
import { approveFunds } from './token.interactions';

const handleTransaction = async (transaction, addr) => {
  try {
    const contract = await tronWeb.contract(loanAbi, addr);
    const result = await transaction(contract);
    return result;
  } catch (error) {
    return error;
  }
};

export const getLoanDetails = async (addr) => {
  const results = await handleTransaction(
    async (contract) => await contract.getLoanDetails().call(),
    addr,
  );
  const balance = utils.formatUnits(results.balance, 18);
  const loan = {
    id: results.id,
    address: addr,
    token: tronWeb.address.fromHex(results.token),
    lenderName: results.lenderName,
    lender: tronWeb.address.fromHex(results.lender),
    borrowerName: results.borrowerName,
    borrower: tronWeb.address.fromHex(results.borrower),
    principal: utils.formatUnits(results.principal, 18),
    dueDate: new Date(results.setDeadline.toString() * 1).toDateString(),
    isPending: balance > 0 ? false : true,
    currentBal: balance > 0 ? balance : utils.formatUnits(results.principal, 18),
    paid: utils.formatUnits(results.paid, 18),
  };

  return loan;
};

export const repayLoan = async (addr, amount) => {
  // Approve the funds
  const res = await approveFunds(addr, amount);
  if (res.error) {
    return res;
  }
  // Repay the loan
  const amountInWei = utils.parseUnits(amount, 18);
  const result = await handleTransaction(
    async (contract) => await contract.RepayLoan(amountInWei).send(),
    addr,
  );
  setTimeout(() => {
    console.log('Waiting for transaction...');
  }, 3000);
  const info = await tronWeb.trx.getTransaction(result);
  if (info.ret[0].contractRet === 'SUCCESS') {
    return [result];
  } else {
    return info.ret[0].contractRet;
  }
};

export const fundLoan = async (addr, amount) => {
  // Approve the funds
  const res = await approveFunds(addr, amount);
  if (res.error) {
    return res;
  }
  // Repay the loan
  const amountInWei = utils.parseUnits(amount, 18);
  const result = await handleTransaction(
    async (contract) => await contract.FundLoan(amountInWei).send(),
    addr,
  );
  setTimeout(() => {
    console.log('Waiting for transaction...');
  }, 3000);
  const info = await tronWeb.trx.getTransaction(result);
  if (info.ret[0].contractRet === 'SUCCESS') {
    return [result];
  } else {
    return info.ret[0].contractRet;
  }
};
