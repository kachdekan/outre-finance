import { spacesAddr, tronWeb } from '@dapp/config';
import spacesAbi from '@dapp/config/abis/spaces.abi.json';
//import { getRoscaDetails } from './rosca.interactions';

const handleTransaction = async (transaction) => {
  try {
    const contract = await tronWeb.contract(spacesAbi, spacesAddr);
    const result = await transaction(contract);
    return result;
  } catch (error) {
    return error;
  }
};

export const createARosca = async (rosca) => {
  const result = await handleTransaction(
    async (contract) =>
      await contract.createRosca(Object.values(rosca)).send({
        feeLimit: 600000000,
        callValue: 0,
      }),
  );
  console.log(result);
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
