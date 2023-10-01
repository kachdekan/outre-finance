import { ONRAddr, tronWeb, stableToken } from '@dapp/config';
import onrsAbi from '@dapp/config/abis/onrs.abi.json';
import { utils } from 'ethers';

const handleTransaction = async (transaction) => {
  try {
    const contract = await tronWeb.contract(onrsAbi, ONRAddr);
    const result = await transaction(contract);
    // https://shasta.tronscan.org/#/transaction/739e6769c07c501dda144c8e90ea093d73ec858a031ec2bb4dc9bdd68ff427ff
    return result;
  } catch (error) {
    throw error;
  }
};

export const getAllOffers = async () => {
  let offers = [];
  const results = await handleTransaction(async (contract) => await contract.getAllOffers().call());
  results.forEach((offer) => {
    offers.push({
      id: offer.id,
      lenderAddr: tronWeb.address.fromHex(offer.lender),
      lenderName: offer.lenderName,
      token: stableToken,
      poolsize: utils.formatUnits(offer.principal, 18),
      minAmount: utils.formatUnits(offer.minLimit, 18),
      maxAmount: utils.formatUnits(offer.maxLimit, 18),
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
      await contract
        .createOffer([
          offer.id,
          offer.lenderAddr,
          offer.lenderName,
          utils.parseUnits(offer.poolsize, 18).toString(),
          utils.parseUnits(offer.minLimit, 18).toString(),
          utils.parseUnits(offer.maxLimit, 18).toString(),
          utils.parseUnits(offer.interest, 2).toString(),
          offer.minDuration,
          offer.maxDuration,
        ])
        .send({
          feeLimit: 600000000,
          callValue: 0,
        }),
  );
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
