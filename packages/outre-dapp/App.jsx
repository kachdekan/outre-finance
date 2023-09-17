import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { Navigation } from './navigation';
import { USER_STORE, WALLETS_STORE } from '@dapp/consts';
import { theme } from './theme';
import { getUserDetails } from '@dapp/services/storage';
import { connectToProvider } from '@dapp/blockchain/provider';
import { setToken, setIsConnected, setUserDetails } from '@dapp/store/essential/essential.slice';
import { getWallets } from '@dapp/features/wallet/wallets-manager';
import { updateWalletAddress } from '@dapp/store/wallet/wallet.slice';
import { useDispatch } from 'react-redux';

export default function App() {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    //LogBox.ignoreLogs(['Encountered two children with the same key ...'])
    //LogBox.ignoreAllLogs();
  }, []);
  // start provider connection
  useEffect(() => {
    async function initProvider() {
      try {
        await connectToProvider();
        dispatch(setIsConnected(true));
      } catch (e) {
        console.log('Unable to connect to provider', e);
        dispatch(setIsConnected(false));
      }
    }
    initProvider();
  }, []);

  // Load resources during splash screen
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        const userDetails = await getUserDetails(USER_STORE);
        const wallets = await getWallets(WALLETS_STORE);
        if (wallets.length > 0) {
          dispatch(updateWalletAddress(wallets[0].address));
        }
        if (userDetails.userToken) {
          dispatch(setToken(userDetails.userToken));
          dispatch(
            setUserDetails({ userNames: userDetails.names, phoneNumber: userDetails.phoneNo }),
          );
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  if (!isReady) {
    return null;
  } else {
    return (
      <NativeBaseProvider theme={theme}>
        <Navigation />
        <StatusBar style="auto" />
      </NativeBaseProvider>
    );
  }
}
