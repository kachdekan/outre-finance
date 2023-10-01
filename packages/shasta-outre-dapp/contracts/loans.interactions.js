import { loansAddr, tronWeb } from '@dapp/config';
import loansAbi from '@dapp/config/abis/loans.abi.json';
import { getLoanDetails } from './loan.interactions';

const handleTransaction = async (transaction) => {
  try {
    const contract = await tronWeb.contract(loansAbi, loansAddr);
    const result = await transaction(contract);
    return result;
  } catch (error) {
    return error;
  }
};

export const getLoans = async () => {};

export const getONRsAddress = async () => {
  return await handleTransaction(async (contract) => await contract.getONRsAddr().call());
};

export const getMyLoans = async () => {
  const results = await handleTransaction(async (contract) => await contract.getMyLoans().call());
  const loans = await Promise.all(
    results.map(async (result, idx) => {
      const loan = await getLoanDetails(result[0]);
      return {
        name: 'Loan ' + (idx + 1) + ' - ' + loan.id,
        address: tronWeb.address.fromHex(result[0]),
        isLender: result[1],
        isPending: loan.isPending,
        principal: loan.principal,
        dueDate: loan.dueDate,
        currentBal: loan.currentBal,
        paid: loan.paid,
        token: 'USDD',
      };
    }),
  );
  return loans;
};

export const borrowLoan = async (loanData) => {
  console.log(loanData);
  const result = await handleTransaction(
    async (contract) =>
      await contract.BorrowLoan(Object.values(loanData)).send({
        feeLimit: 600000000,
        callValue: 0,
      }),
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

export const lendLoan = async () => {};
