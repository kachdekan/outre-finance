import { WALLETS_STORE } from '@dapp/config';
import { getUserWallets, storeUserWallet } from '@dapp/services';
import { encryptData } from '@dapp/utils';
import { tronWeb } from '@dapp/config';
import { utils } from 'ethers';

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
  await storeUserWallet(WALLETS_STORE, newWallet);
  Object.assign(walletsListCache, { [wallet.address]: newWallet });
}

export function getWalletBalances(data) {
  if (!data) return null;
  return {
    trxAvaibleBal: tronWeb.fromSun(data.data[0].balance) * 1,
    trxFrozenBand: data.data[0].frozenV2[0].amount
      ? tronWeb.fromSun(data.data[0].frozenV2[0].amount) * 1
      : 0,
    trxFrozenEnergy: data.data[0].frozenV2[1].amount
      ? tronWeb.fromSun(data.data[0].frozenV2[0].amount) * 1
      : 0,
    usddBal: data.data[0].trc20[0]
      ? utils.formatUnits(Object.values(data.data[0].trc20[0])[0], 18).toString() * 1
      : 0,
  };
}

export function getWalletTxs(accountTxs, trc20Txs, address) {
  if (!accountTxs || !trc20Txs) return [];
  const txs = accountTxs.data.filter(
    (item) =>
      item.raw_data.contract[0].type === 'TransferContract' ||
      item.raw_data.contract[0].type === 'FreezeBalanceV2Contract',
  );
  const thisTxs = txs.map((item) => {
    const { amount, frozen_balance, owner_address } = item.raw_data.contract[0].parameter.value;
    const txDate = new Date(item.raw_data.timestamp);
    const date = txDate.toDateString().split(' ');
    return {
      id: item.txID,
      title:
        item.raw_data.contract[0].type === 'TransferContract'
          ? tronWeb.address.fromHex(owner_address) !== address
            ? 'Received TRX'
            : 'Transfered TRX'
          : 'Staked TRX (2.0)',
      date: date[0] + ', ' + date[2] + ' ' + date[1] + ', ' + txDate.toTimeString().slice(0, 5),
      token: 'TRX',
      amount: frozen_balance ? utils.formatUnits(frozen_balance, 6) : utils.formatUnits(amount, 6),
      credited: tronWeb.address.fromHex(owner_address) !== address,
      timestamp: item.raw_data.timestamp,
    };
  });
  const thisTrc20Txs = trc20Txs.data.map((item) => {
    const txDate = new Date(item.block_timestamp);
    const date = txDate.toDateString().split(' ');
    return {
      id: item.transaction_id,
      title:
        item.from !== address
          ? 'Received ' + item.token_info.symbol
          : 'Transfered ' + item.token_info.symbol,
      date: date[0] + ', ' + date[2] + ' ' + date[1] + ', ' + txDate.toTimeString().slice(0, 5),
      token: item.token_info.symbol,
      amount: utils.formatUnits(item.value, item.token_info.decimals),
      credited: item.from !== address,
      timestamp: item.block_timestamp,
    };
  });
  thisTxs.push(...thisTrc20Txs);
  thisTxs.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
  return thisTxs;
}
