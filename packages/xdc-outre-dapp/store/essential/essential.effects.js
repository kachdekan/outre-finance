import { setIsConnected, setLoggedIn, createAccount, setIsSignered } from './essential.slice';

import { userToken } from '@dapp/config/usertoken';
import { storeUserDetails } from '@dapp/services';
import { USER_STORE } from '@dapp/config/constants';
import { isKeySet, setSigner } from '@dapp/config/signer';

export const essentialListeners = (startListening) => {
  startListening({
    actionCreator: createAccount,
    effect: async (action, listenerApi) => {
      const userDetails = listenerApi.getState().essential.userDetails;
      const userData = { ...userDetails, token: userToken };
      if (userDetails.phone === '' && !userToken) {
        throw new Error('Problem getting user details');
      }
      await storeUserDetails(USER_STORE, userData);
    },
  });
  startListening({
    actionCreator: setLoggedIn,
    effect: async (action, listenerApi) => {
      const isConnected = listenerApi.getState().essential.isConnected;
      const address = listenerApi.getState().wallet.walletInfo.address;

      if (isConnected) {
        if (isKeySet() && action.payload) {
          await setSigner();
          listenerApi.dispatch(setIsSignered(true));
          console.log(address);
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
