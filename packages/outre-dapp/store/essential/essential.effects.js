import {
  setIsConnected,
  setIsSignered,
  setLoggedIn,
  setUserToken,
} from '@dapp/store/essential/essential.slice';
import { setAppSigner } from '@dapp/blockchain/blockchainHelper';
import { connectToProvider } from '@dapp/blockchain/provider';
import { getWallets } from '@dapp/features/wallet/wallets-manager';
import { decryptDataWtoken } from '@dapp/utils/encryption';
import { storeUserDetails } from '@dapp/services/storage';
import { USER_STORE } from '@dapp/consts';

export const essentialListeners = (startListening) => {
  startListening({
    actionCreator: setUserToken,
    effect: async (action, listenerApi) => {
      const userDetails = listenerApi.getState().essential.userDetails;
      if (userDetails.userToken !== action.payload) {
        throw new Error('Problem getting user token');
      }
      await storeUserDetails(USER_STORE, userDetails);
    },
  });
  startListening({
    actionCreator: setLoggedIn,
    effect: async (action, listenerApi) => {
      const isConnected = listenerApi.getState().essential.isConnected;
      const userDetails = listenerApi.getState().essential.userDetails;
      const address = listenerApi.getState().wallet.walletInfo.address;
      console.log(address);
      //get private key from store
      const userWallets = await getWallets();
      const enPrivateKey = userWallets.find((w) => w.address === address).enPrivateKey;
      const privateKey = await decryptDataWtoken(enPrivateKey, userDetails.userToken);

      if (isConnected) {
        if (privateKey && action.payload) {
          await setAppSigner(privateKey);
          listenerApi.dispatch(setIsSignered(true));
        } else {
          console.log('Unable to set signer');
          listenerApi.dispatch(setIsSignered(false));
        }
      } else {
        try {
          await connectToProvider();
          listenerApi.dispatch(setIsConnected(true));
        } catch (error) {
          console.log('Unable to connect to provider', error);
          listenerApi.dispatch(setIsConnected(false));
        }
      }
    },
  });
};
