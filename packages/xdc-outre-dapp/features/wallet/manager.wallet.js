import { DERIVATION_PATH, WALLETS_STORE } from '@dapp/config/constants';
import { getUserWallets, storeUserWallet } from '@dapp/services';
import { encryptData, areAddressesEqual } from '@dapp/utils';
import { Wallet, utils } from 'ethers';
import { getTokenBalance } from '@dapp/contracts';
import { getProvider } from '@dapp/config/provider';

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

export async function getWalletBalances(isSignered, addr) {
  if (!addr && !isSignered) {
    return null;
  }
  const provider = getProvider();
  const balance = await provider.getBalance(addr);
  const xdcBal = utils.formatUnits(balance, 18);
  const usxdBal = await getTokenBalance(addr);
  return {
    xdcBal: Number(xdcBal),
    usxdBal: Number(usxdBal),
  };
}

export function getWalletTxs(accountTxs, xrc20Txs, address) {
  if (!accountTxs || !xrc20Txs) return [];
  const txs = accountTxs.items.filter((tx) => tx.value !== '0');
  const thisTxs = txs.map((tx) => {
    const txDate = new Date(tx.timestamp);
    const date = txDate.toDateString().split(' ');
    return {
      id: tx._id,
      title: areAddressesEqual(tx.to.replace('xdc', '0x'), address)
        ? 'Received XDC'
        : 'Transfered XDC',
      date: date[0] + ', ' + date[2] + ' ' + date[1] + ', ' + txDate.toTimeString().slice(0, 5),
      token: 'XDC',
      amount: utils.formatUnits(tx.value, 18).toString(),
      credited: areAddressesEqual(tx.to.replace('xdc', '0x'), address),
      timestamp: txDate.getTime(),
    };
  });

  const thisXrc20Txs = xrc20Txs.items.map((tx) => {
    const txDate = new Date(tx.timestamp);
    const date = txDate.toDateString().split(' ');
    return {
      id: tx._id,
      title: areAddressesEqual(tx.to.replace('xdc', '0x'), address)
        ? 'Received USXD'
        : 'Transfered USXD',
      date: date[0] + ', ' + date[2] + ' ' + date[1] + ', ' + txDate.toTimeString().slice(0, 5),
      token: tx.symbol,
      amount: utils.formatUnits(tx.value, tx.decimals).toString(),
      credited: areAddressesEqual(tx.to.replace('xdc', '0x'), address),
      timestamp: txDate.getTime(),
    };
  });

  thisTxs.push(...thisXrc20Txs);
  thisTxs.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
  return thisTxs;
}
