import { WALLETS_STORE } from '@dapp/consts';
import { getUserWallets } from '@dapp/services/storage';

export const walletsListCache = {};

export async function hasWallets() {
  const result = await getWallets();
  return result.length !== 0;
}

export async function getDefaultNewWalletName() {
  const list = await getWallets();
  return `Wallet ${list.length + 1}`;
}

export async function getWallets() {
  if (Object.keys(walletsListCache).length <= 0) {
    const storedWallets = await getUserWallets(WALLETS_STORE);
    if (Object.values(storedWallets).length > 0) {
      for (const wallet of Array.from(storedWallets)) {
        Object.assign(walletsListCache, { [wallet.address]: wallet });
      }
    }
  }
  return Object.values(walletsListCache); //Always return a list
}
