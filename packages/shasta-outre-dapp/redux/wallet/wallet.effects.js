import {
  createWallet,
  importWallet,
  updateWalletAddress,
} from './wallet.slice';
//import { getPendingWallet } from '@dapp/features/wallet';
import { setLoggedIn } from '@dapp/store/essential/essential.slice';
import { storeWallet } from '@dapp/features/wallet';
import { createRandom } from "tronweb"

export const walletListeners = (startListening) => {
  startListening({
    actionCreator: createWallet,
    effect: async (action, listenerApi) => {
      if (action.payload) {
        console.log('Creating and Storing Wallet');
        const passcode = action.payload;
        const wallet = await createRandom();
        console.log('wallet', wallet);
        await storeWallet(passcode, wallet);
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