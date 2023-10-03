import { tronWeb } from '@dapp/config';
import P2PLoanAbi from '@dapp/config/abis/P2PLoan.abi.json';
import { utils } from 'ethers';
const P2PLoanIface = new utils.Interface(P2PLoanAbi);

export async function getLoanTxs(loanTxs, address) {
  if (!loanTxs) return [];
  const txs = loanTxs.data.filter(
    (item) => 'raw_data' in item && item.raw_data.contract[0].type === 'TriggerSmartContract',
  );
  let thisTxs = [];
  const thisTxs_ = await Promise.all(
    txs.map(async (item, idx) => {
      const res = await tronWeb.getEventByTransactionID(item.txID);
      if (typeof res !== 'undefined' && res.length > 0) {
        if (typeof res[1].result !== 'undefined') {
          const txDate = new Date(item.block_timestamp * 1);
          const date = txDate.toDateString().split(' ');
          const thisAddress = tronWeb.address.fromHex(res[1].result.from);
          return {
            id: item.txID,
            title: thisAddress !== address ? 'Received USDD' : 'Repaid USDD',
            date:
              date[0] + ', ' + date[2] + ' ' + date[1] + ', ' + txDate.toTimeString().slice(0, 5),
            token: 'USDD',
            amount: utils.formatUnits(res[1].result.value, 18),
            credited: thisAddress !== address,
            timestamp: item.block_timestamp,
          };
        }
      }
    }),
  );
  thisTxs = thisTxs_.filter((item) => typeof item !== 'undefined');
  return thisTxs;
}
