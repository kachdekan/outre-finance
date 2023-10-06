import loanAbi from '@dapp/config/abis/P2PLoan.abi.json';
import { approveFunds } from './token.interactions';
import { Contract, utils, BigNumber } from 'ethers';
import { getSigner } from '@dapp/config/signer';

const delay = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const handleTransaction = async (transaction, address) => {
  try {
    const signer = getSigner();
    const contract = new Contract(address, loanAbi, signer);
    const result = await transaction(contract);
    return result;
  } catch (error) {
    return error;
  }
};

export const getLoanDetails = async (addr) => {
  const results = await handleTransaction(
    async (contract) => await contract.getLoanDetails(),
    addr,
  );
  const balance = utils.formatUnits(results.balance, 6);
  const loan = {
    id: results.id,
    address: addr,
    token: results.token,
    lenderName: results.lenderName,
    lender: results.lender,
    borrowerName: results.borrowerName,
    borrower: results.borrower,
    principal: utils.formatUnits(results.principal, 6),
    dueDate: new Date(results.setDeadline.toString() * 1).toDateString(),
    isPending: balance > 0 ? false : true,
    currentBal: balance > 0 ? balance : utils.formatUnits(results.principal, 6),
    paid: utils.formatUnits(results.paid, 6),
  };

  return loan;
};

export const repayLoan = async (addr, amount) => {
  console.log('repayLoan');
  // Approve the funds
  const res = await approveFunds(addr, amount);
  if (res.error) {
    return res;
  }
  // Repay the loan
  const amountInWei = utils.parseUnits(amount, 6);
  const nonce = await getCurrentNonce();
  const result = await handleTransaction(
    async (contract) => await contract.RepayLoan(amountInWei, { nonce: nonce + 1 }),
    addr,
  );
  //delay(3000);
  const txReceipt = await result.wait();
  return {
    txHash: txReceipt.transactionHash,
    status: txReceipt.status,
  };
};

export const fundLoan = async (addr, amount) => {
  // Approve the funds
  const res = await approveFunds(addr, amount);
  if (res.error) {
    return res;
  }
  // Repay the loan
  const amountInWei = utils.parseUnits(amount, 6);
  const nonce = await getCurrentNonce();
  const result = await handleTransaction(
    async (contract) => await contract.FundLoan(amountInWei, { nonce: nonce + 1 }),
    addr,
  );
  //delay(3000);
  const txReceipt = await result.wait();
  return {
    txHash: txReceipt.transactionHash,
    status: txReceipt.status,
  };
};

export const getCurrentNonce = async () => {
  const signer = getSigner();
  const nonce = await signer.getTransactionCount('pending');
  return BigNumber.from(nonce).toNumber();
};
