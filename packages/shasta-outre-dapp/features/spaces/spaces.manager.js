import { tronWeb } from '@dapp/config';
import roscaAbi from '@dapp/config/abis/rosca.abi.json';
import { utils } from 'ethers';
const RoscaIface = new utils.Interface(roscaAbi);

export async function getSpaceTxs(roscaTxs, address) {
  if (!roscaTxs) return [];
  const txs = roscaTxs.data.filter(
    (item) => 'raw_data' in item && item.raw_data.contract[0].type === 'TriggerSmartContract',
  );
  const thisTxs = await Promise.all(
    txs.map(async (item) => {
      const res = await tronWeb.getEventByTransactionID(item.txID);
      const thisRes = res.filter((item) => item.name === 'Transfer')[0].result;
      const txDate = new Date(item.block_timestamp * 1);
      const date = txDate.toDateString().split(' ');
      const thisAddress = tronWeb.address.fromHex(thisRes.from);
      return {
        id: item.txID,
        title: thisAddress !== address ? 'Transfered USDD' : 'Funded USDD',
        date: date[0] + ', ' + date[2] + ' ' + date[1] + ', ' + txDate.toTimeString().slice(0, 5),
        token: 'USDD',
        amount: utils.formatUnits(thisRes.value, 18),
        credited: thisAddress !== address,
        timestamp: item.block_timestamp,
      };
    }),
  );
  //console.log(thisTxs);
  return thisTxs;
}
