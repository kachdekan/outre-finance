import { tronWeb } from '@dapp/config';
import loanAbi from '@dapp/config/abis/P2PLoan.abi.json';
import { utils } from 'ethers';
import { LoansData } from '../data';

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
