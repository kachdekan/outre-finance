import { tronWeb } from '@dapp/config';
import roscaAbi from '@dapp/config/abis/rosca.abi.json';
import { utils } from 'ethers';
import { approveFunds } from './token.interactions';

const handleTransaction = async (transaction, addr) => {
  try {
    const contract = await tronWeb.contract(roscaAbi, addr);
    const result = await transaction(contract);
    return result;
  } catch (error) {
    return error;
  }
};
