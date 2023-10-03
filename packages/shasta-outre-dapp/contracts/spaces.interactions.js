import { spacesAddr, tronWeb } from '@dapp/config';
import spacesAbi from '@dapp/config/abis/spaces.abi.json';
import { getSpaceDetails } from './rosca.interactions';

const delay = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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
        feeLimit: 1000000000,
        callValue: 0,
      }),
  );
  delay(5000);
  console.log('Transaction result:', result);
  const info = await tronWeb.trx.getTransaction(result);
  if (info.ret[0].contractRet === 'SUCCESS') {
    return [result];
  } else {
    return info.ret[0].contractRet;
  }
};

export const getMySpaces = async () => {
  const results = await handleTransaction(async (contract) => await contract.getMySpaces().call());
  const spaces = await Promise.all(
    results.map(async (result, idx) => {
      const space = await getSpaceDetails(result[0]);
      return {
        id: idx,
        name: space.roscaName,
        address: tronWeb.address.fromHex(result[0]),
        creator: space.creator,
        goalAmount: space.goalAmount,
        dueDate: space.dueDate,
        roscaBal: space.roscaBal,
        token: 'USDD',
      };
    }),
  );
  return spaces;
};
