import {
  createWallet,
  fetchBalances,
  importWallet,
  updateBalances,
  updateWalletAddress,
} from './wallet.slice';
import {
  getBalances,
  smartContractCall,
  createWallet as helperCreateWallet,
} from '@dapp/blockchain/blockchainHelper';
import { NativeTokensByAddress } from '@dapp/features/wallet/tokens';
import { encryptData } from '@dapp/utils/encryption';
import { storeUserWallet } from '@dapp/services/storage';
import { WALLETS_STORE } from '@dapp/consts';
import { getDefaultNewWalletName, walletsListCache } from '@dapp/features/wallet/wallets-manager';
import { getPendingWallet } from '@dapp/features/wallet/pending-wallet';
import { setLoggedIn } from '@dapp/store/essential/essential.slice';
//import { setONRsAddress } from '../microloans/loansSlice';

//import { config } from 'clixpesa/blockchain/configs.js';

export const walletListeners = (startListening) => {
  startListening({
    actionCreator: fetchBalances,
    effect: async (action, listenerApi) => {
      const isSignerSet = listenerApi.getState().essential.isSignerSet;
      const address = listenerApi.getState().wallet.walletInfo.address;
      if (isSignerSet && address) {
        const tokenAddrToValue = await getBalances(address, NativeTokensByAddress);
        /*const addr = await smartContractCall('Loans', {
          contractAddress: config.contractAddresses['Loans'],
          method: 'getONRsAddr',
          methodType: 'read',
        });*/
        //listenerApi.dispatch(setONRsAddress(addr));
        listenerApi.dispatch(updateBalances({ tokenAddrToValue, lastUpdated: Date.now() }));
      }
    },
  });
  startListening({
    actionCreator: createWallet,
    effect: async (action, listenerApi) => {
      if (action.payload) {
        console.log('Creating and Storing Wallet');
        const passcode = action.payload;
        const wallet = await helperCreateWallet();
        await addWallet(passcode, wallet);
        listenerApi.dispatch(updateWalletAddress(wallet.address));
        listenerApi.dispatch(setLoggedIn(true));
      }
    },
  });
  startListening({
    actionCreator: importWallet,
    effect: async (action, listenerApi) => {
      console.log('Importing wallet from Mnemonic');
      const passcode = action.payload;
      const { importedWallet } = getPendingWallet();
      await addWallet(passcode, importedWallet);
      const currentAddr = listenerApi.getState().wallet.walletInfo.address;
      if (!currentAddr) {
        listenerApi.dispatch(updateWalletAddress(importedWallet.address));
        listenerApi.dispatch(setLoggedIn(true));
      }
    },
  });
};

async function addWallet(passcode, wallet) {
  console.log('Adding wallet to store');
  const enPrivateKey = await encryptData(wallet.privateKey, passcode);
  const enMnemonic = await encryptData(wallet.mnemonic, passcode);
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
