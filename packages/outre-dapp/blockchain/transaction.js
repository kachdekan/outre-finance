/**
 * Utilities to facilitate sending transactions with
 * different gas currencies. Prefer these to
 * sending with Ethers directly.
 */
import { BigNumber } from 'ethers';
import { getProvider } from './provider';
import { getSigner } from './signer';

export async function sendTransaction(tx, feeEstimate) {
  const signedTx = await signTransaction(tx, feeEstimate);
  return sendSignedTransaction(signedTx);
}

export async function signTransaction(tx, feeEstimate) {
  const signer = getSigner();
  if (!feeEstimate) {
    // For now, require fee to be pre-computed when using this utility
    // May revisit later
    throw new Error('Fee estimate required to send tx');
  }
  const { gasLimit } = feeEstimate;
  const signedTx = await signer.signTransaction({
    ...tx,
    // TODO: set gatewayFeeRecipient
    //feeCurrency: feeToken,
    //gasLimit: gasLimit,
    //type: 2,
  });
  return signedTx;
}

export async function sendSignedTransaction(signedTx) {
  const provider = getProvider();
  const txResponse = await provider.sendTransaction(signedTx);
  const txReceipt = await txResponse.wait();
  return txReceipt;
}

export async function getCurrentNonce() {
  const signer = getSigner();
  const nonce = await signer.getTransactionCount('pending');
  return BigNumber.from(nonce).toNumber();
}
