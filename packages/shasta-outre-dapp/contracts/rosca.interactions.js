import { tronWeb } from '@dapp/config';
import roscaAbi from '@dapp/config/abis/rosca.abi.json';
import { utils } from 'ethers';
import { approveFunds } from './token.interactions';

const delay = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const handleTransaction = async (transaction, addr) => {
  try {
    const contract = await tronWeb.contract(roscaAbi, addr);
    const result = await transaction(contract);
    return result;
  } catch (error) {
    return error;
  }
};

export const getSpaceDetails = async (addr) => {
  const result = await handleTransaction(
    async (contract) => await contract.getDetails().call(),
    addr,
  );
  const space = {
    roscaName: result.roscaName,
    imgLink: result.imgLink,
    goalAmount: utils.formatUnits(result.goalAmount.toString(), 18),
    ctbDay: result.ctbDay,
    ctbOccur: result.ctbOccur,
    disbDay: result.disbDay,
    disbOccur: result.ctbOccur,
    dueDate: new Date(result.nxtDeadline.toString() * 1000).toDateString(),
    activeMembers: utils.formatUnits(result.activeMembers.toString(), 0),
    currentRound: utils.formatUnits(result.currentRound.toString(), 0),
    creator: tronWeb.address.fromHex(result.creator),
    roscaBal: utils.formatUnits(result.roscaBal.toString(), 18),
    roscaAddr: addr,
  };
  return space;
};

export const fundSpace = async (addr, amount) => {
  console.log(addr, amount);
  const res = await approveFunds(addr, amount);
  if (res.error) {
    return res;
  }
  const amountInWei = utils.parseUnits(amount, 18);
  const result = await handleTransaction(
    async (contract) => await contract.fundRound(amountInWei).send(),
    addr,
  );
  delay(3000);
  const info = await tronWeb.trx.getTransaction(result);
  if (info.ret[0].contractRet === 'SUCCESS') {
    return [result];
  } else {
    return info.ret[0].contractRet;
  }
};
