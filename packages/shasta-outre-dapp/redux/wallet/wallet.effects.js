import { createWallet, importWallet, updateWalletAddress } from './wallet.slice';
//import { getPendingWallet } from '@dapp/features/wallet';
import { setLoggedIn } from '@dapp/store/essential/essential.slice';
import { setPrivateKey } from '@dapp/config';
import { getWallets } from '@dapp/features/wallet';
import { decryptDataWtoken } from '@dapp/utils';
import { storeWallet } from '@dapp/features/wallet';
import { userToken } from '@dapp/features/essentials/user.token';
import { createRandom } from 'tronweb';
import { tronWeb } from '@dapp/config';
import { getWalletInfo } from '@dapp/features/wallet';
import { shastaApi } from '@dapp/services';

export const walletListeners = (startListening) => {
  startListening({
    actionCreator: createWallet,
    effect: async (action, listenerApi) => {
      if (action.payload) {
        console.log('Creating and Storing Wallet');
        const passcode = action.payload;
        const wallet = await createRandom();
        await storeWallet(passcode, wallet);
        listenerApi.dispatch(updateWalletAddress(wallet.address));
        //Activate the wallet
      }
    },
  });
  startListening({
    actionCreator: importWallet,
    effect: async (action, listenerApi) => {
      console.log('Importing wallet from Mnemonic');
      const passcode = action.payload;
      const { importedWallet } = getPendingWallet();
      await storeWallet(passcode, importedWallet);
      const currentAddr = listenerApi.getState().wallet.walletInfo.address;
      if (!currentAddr) {
        listenerApi.dispatch(updateWalletAddress(importedWallet.address));
        //listenerApi.dispatch(setLoggedIn(true));
      }
    },
  });
};
