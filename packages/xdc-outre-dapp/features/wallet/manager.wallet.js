import { DERIVATION_PATH, WALLETS_STORE } from '@dapp/config/constants';
import { getUserWallets, storeUserWallet } from '@dapp/services';
import { encryptData } from '@dapp/utils';
import { Wallet, utils } from 'ethers';

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

export async function generateWallet(derivationPath) {
  const path = derivationPath || DERIVATION_PATH;
  const entropy = utils.randomBytes(32);
  const mnemonic = utils.entropyToMnemonic(entropy);
  const wallet = Wallet.fromMnemonic(mnemonic, path);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  };
}

export async function generateWalletFromMnemonic(mnemonic, derivationPath) {
  const path = derivationPath || DERIVATION_PATH;
  const wallet = Wallet.fromMnemonic(mnemonic, path);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  };
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
  };
  await storeUserWallet(WALLETS_STORE, newWallet);
  Object.assign(walletsListCache, { [wallet.address]: newWallet });
}

export function getWalletBalances(data) {
  if (!data) {
    return null;
  }
  return data.data[0] ? {} : {};
}

export function getWalletTxs(accountTxs, xrc20Txs, address) {
  if (!accountTxs || !xrc20Txs) return [];

  //thisTxs.push(...thisTrc20Txs);
  //thisTxs.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
  return []; //thisTxs;
}
