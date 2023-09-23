import { WALLETS_STORE } from '@dapp/config';
import { getUserWallets, storeUserWallet } from '@dapp/services';
import { encryptData } from '@dapp/utils';


export const walletsListCache = {}

export async function hasWallets() {
  const result = await getWallets()
  return result.length !== 0
}

export async function getDefaultNewWalletName() {
  const list = await getWallets()
  return `Wallet ${list.length + 1}`
}

export async function getWallets() {
  if (Object.keys(walletsListCache).length <= 0) {
    const storedWallets = await getUserWallets(WALLETS_STORE)
    if (Object.values(storedWallets).length > 0) {
      for (const wallet of Array.from(storedWallets)) {
        Object.assign(walletsListCache, { [wallet.address]: wallet })
      }
    }
  }
  return Object.values(walletsListCache) //Always return a list
}

export async function storeWallet(passcode, wallet) {
  console.log('Adding wallet to store');
  const enPrivateKey = await encryptData(wallet.privateKey, passcode);
  const enMnemonic = await encryptData(wallet.mnemonic.phrase, passcode);
  const walletName = await getDefaultNewWalletName();
  const newWallet = {
    walletName: walletName,
    address: wallet.address,
    enPrivateKey: enPrivateKey,
    enMnemonic: enMnemonic,
    publicKey: wallet.publicKey,
  };
  console.log('newWallet', newWallet);
  await storeUserWallet(WALLETS_STORE, newWallet);
  Object.assign(walletsListCache, { [wallet.address]: newWallet });
}
