import { loansAddr } from '@dapp/config/appconfig';
import loansAbi from '@dapp/config/abis/loans.abi.json';
import { getLoanDetails } from './loan.interactions';
import { Contract, utils } from 'ethers';
import { getSigner } from '@dapp/config/signer';
import { getProvider } from '@dapp/config/provider';

let cachedContract = null;

const delay = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const handleTransaction = async (transaction) => {
  //const provider = getProvider();
  try {
    const signer = getSigner();
    const contract = cachedContract || new Contract(loansAddr, loansAbi, signer);
    if (!cachedContract) cachedContract = contract;
    const result = await transaction(contract);
    return result;
  } catch (error) {
    return error;
  }
};

export const getLoans = async () => {};

export const getONRsAddress = async () => {
  return await handleTransaction(async (contract) => await contract.getONRsAddr());
};

export const getMyLoans = async () => {
  const results = await handleTransaction(async (contract) => await contract.getMyLoans());
  const loans = await Promise.all(
    results.map(async (result, idx) => {
      const loan = await getLoanDetails(result[0]);
      return {
        name: 'Loan ' + (idx + 1) + ' - ' + loan.id,
        address: result[0],
        isLender: result[1],
        isPending: loan.isPending,
        principal: loan.principal,
        dueDate: loan.dueDate,
        currentBal: loan.currentBal,
        paid: loan.paid,
        token: 'USXD',
      };
    }),
  );
  return loans;
};

export const borrowLoan = async (loanData) => {
  const result = await handleTransaction(
    async (contract) => await contract.BorrowLoan(Object.values(loanData)),
  );
  //delay(5000);
  const txReceipt = await result.wait();
  return {
    txHash: txReceipt.transactionHash,
    status: txReceipt.status,
  };
};

export const lendLoan = async () => {};
