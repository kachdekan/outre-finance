import P2PLoanAbi from '@dapp/config/abis/P2PLoan.abi.json';
import { utils } from 'ethers';
//const P2PLoanIface = new utils.Interface(P2PLoanAbi);

export async function getLoanTxs(loanTxs, address) {
  if (!loanTxs) return [];
  const thisTxs = loanTxs.items.map((tx) => {
    const txDate = new Date(tx.timestamp);
    const date = txDate.toDateString().split(' ');
    return {
      id: tx._id,
      title: areAddressesEqual(tx.to.replace('xdc', '0x'), address)
        ? 'Received USXD'
        : 'Transfered USXD',
      date: date[0] + ', ' + date[2] + ' ' + date[1] + ', ' + txDate.toTimeString().slice(0, 5),
      token: tx.symbol,
      amount: utils.formatUnits(tx.value, tx.decimals).toString(),
      credited: areAddressesEqual(tx.to.replace('xdc', '0x'), address),
      timestamp: txDate.getTime(),
    };
  });
  return thisTxs;
}
