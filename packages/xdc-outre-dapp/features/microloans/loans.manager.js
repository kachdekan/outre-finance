import P2PLoanAbi from '@dapp/config/abis/P2PLoan.abi.json';
import { utils } from 'ethers';
import { areAddressesEqual } from '@dapp/utils';
import { getProvider } from '@dapp/config/provider';
const P2PLoanIface = new utils.Interface(P2PLoanAbi);

export async function getLoanTxs(loanTxs, address, loanAddress) {
  if (!loanTxs) return [];

  const thisTxs = await Promise.all(
    loanTxs.items.map(async (tx) => {
      const txReceipt = await getProvider().getTransactionReceipt(tx.hash);
      const { data, topics } = txReceipt.logs.find((log) => log.address === loanAddress);
      const decodedLog = P2PLoanIface.parseLog({ data, topics });
      const txDate = new Date(tx.timestamp);
      const date = txDate.toDateString().split(' ');
      return {
        id: tx._id,
        title: areAddressesEqual(decodedLog.args[1], address) ? 'Received USXD' : 'Funded USXD',
        date: date[0] + ', ' + date[2] + ' ' + date[1] + ', ' + txDate.toTimeString().slice(0, 5),
        token: 'USXD',
        amount: utils.formatUnits(decodedLog.args.amount, 6).toString(),
        credited: areAddressesEqual(decodedLog.args[1], address),
        timestamp: txDate.getTime(),
      };
    }),
  );

  return thisTxs;
}
