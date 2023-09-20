import {
  setIsConnected,
  setLoggedIn,
  createAccount,
} from '@dapp/store/essential/essential.slice';
 
import { userToken } from '@dapp/features/essentials';

export const essentialListeners = (startListening) => {
  

  startListening({
    actionCreator: createAccount,
    effect: async (action, listenerApi) => {
      
      const userDetails = listenerApi.getState().essential.userDetails;
      const userData = { ...userDetails, token: userToken };
      if (userDetails.phone === '') {
        throw new Error('Problem getting user details');
      }
      console.log(userData);
      //call api
    },
  });
};