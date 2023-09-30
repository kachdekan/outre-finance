import { loansAddr, tronWeb } from '@dapp/config';
import loansAbi from '@dapp/config/abis/loans.abi.json';

const handleTransaction = async (transaction) => {
  try {
    const contract = await tronWeb.contract(loansAbi, loansAddr);
    const result = await transaction(contract);
    // https://shasta.tronscan.org/#/transaction/739e6769c07c501dda144c8e90ea093d73ec858a031ec2bb4dc9bdd68ff427ff
    return result;
  } catch (error) {
    throw error;
  }
};

export const getLoans = async () => {};

export const getONRsAddress = async () => {
  return await handleTransaction(async (contract) => await contract.getONRsAddr().call());
};

export const getMyLoans = async () => {
  return await handleTransaction(async (contract) => await contract.getMyLoans().call());
};

export const borrowLoan = async (loanData) => {
  console.log(loanData);
  const result = await handleTransaction(
    async (contract) => await contract.BorrowLoan(Object.values(loanData)).send(),
  );
  const info = await tronWeb.trx.getTransaction(result);
  console.log(info.ret[0].contractRet);
  if (info.ret[0].contractRet === 'SUCCESS') {
    return result;
  } else {
    //return info.ret[0].contractRet;
    throw new Error('Transaction failed: ', info.ret[0].contractRet);
  }
};

export const lendLoan = async () => {};
