import { ONRAddr, stableToken } from '@dapp/config/appconfig';
import onrsAbi from '@dapp/config/abis/onrs.abi.json';
import { Contract, utils } from 'ethers';
import { getSigner } from '@dapp/config/signer';

let cachedContract = null;

const delay = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const handleTransaction = async (transaction) => {
  try {
    const signer = getSigner();
    const contract = cachedContract || new Contract(ONRAddr, onrsAbi, signer);
    if (!cachedContract) cachedContract = contract;
    const result = await transaction(contract);
    return result;
  } catch (error) {
    return error;
  }
};

export const getAllOffers = async () => {
  let offers = [];
  const results = await handleTransaction(async (contract) => await contract.getAllOffers());
  results.forEach((offer) => {
    offers.push({
      id: offer.id,
      lenderAddr: offer.lender,
      lenderName: offer.lenderName,
      token: stableToken,
      poolsize: utils.formatUnits(offer.principal, 6),
      minAmount: utils.formatUnits(offer.minLimit, 6),
      maxAmount: utils.formatUnits(offer.maxLimit, 6),
      interest: utils.formatUnits(offer.interest, 2),
      minDuration: utils.formatUnits(offer.minDuration, 0), //in days
      maxDuration: utils.formatUnits(offer.maxDuration, 0), //in days
    });
  });
  return offers;
};

export const createAnOffer = async (offer) => {
  //console.log(offer);
  const result = await handleTransaction(
    async (contract) =>
      await contract.createOffer([
        offer.id,
        offer.lenderAddr,
        offer.lenderName,
        utils.parseUnits(offer.poolsize, 6).toString(),
        utils.parseUnits(offer.minLimit, 6).toString(),
        utils.parseUnits(offer.maxLimit, 6).toString(),
        utils.parseUnits(offer.interest, 2).toString(),
        offer.minDuration,
        offer.maxDuration,
      ]),
  );
  //delay(3000);
  const txReceipt = await result.wait();
  return {
    txHash: txReceipt.transactionHash,
    status: txReceipt.status,
  };
};
