import { Wallet } from 'ethers';
import { generateWalletFromMnemonic } from '@dapp/blockchain/blockchainHelper';
import { normalizeMnemonic } from '@dapp/utils/mnemonic';

export let pendingWallet = null; //{Wallet, isImported}

export async function setPendingWallet(mnemonic, isImported = true) {
  if (pendingWallet) {
    console.warn('Overwriting existing pending account'); //replace with degugging logger
  }
  const formattedMnemonic = normalizeMnemonic(mnemonic);
  const importedWallet = await generateWalletFromMnemonic(formattedMnemonic);
  pendingWallet = { importedWallet, isImported };
  console.log(pendingWallet);
  console.log('Pending Set');
}

export function setPendingWithWallet(isImported = false) {
  const wallet = Wallet;
  if (pendingWallet) {
    console.warn('Overwriting existing pending account');
  }
  pendingWallet = { wallet, isImported };
}

export function getPendingWallet() {
  const pending = pendingWallet;
  // Auto-clear it after first read
  pendingWallet = null;
  return pending;
}
