import { Wallet } from 'ethers';
import { isProviderSet, getProvider } from './provider';

// Note this is the wallet's local signer, not to be confused with
// vote signers in the Accounts contract
let privateKey = null;
let signer = {};

export function setPrivateKey(key) {
  privateKey = key;
}

export function isKeySet() {
  return !!privateKey;
}

export function isSignerSet() {
  return !!signer;
}

export function getSigner() {
  if (!signer) {
    console.log('Signer is not yet initialized');
    throw new Error('Attempting to use signer before initialized');
  }
  return signer;
}

export function setSigner() {
  if (!privateKey) {
    throw new Error('invalid Key');
  }

  if (!isProviderSet()) {
    throw new Error('Provider must be set before signer');
  }

  if (signer) {
    console.log('Signer is being overridden');
  }

  const provider = getProvider();
  signer = new Wallet(privateKey, provider);
  console.log('Signer is set');
}

export function clearSigner() {
  signer = undefined;
}
