import {
  setIsConnected,
  setLoggedIn,
  createAccount,
} from '@dapp/store/essential/essential.slice';
 
import { userToken } from '@dapp/features/essentials/user.token';
import { storeUserDetails } from '@dapp/services';
import { USER_STORE } from '@dapp/config';


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
};