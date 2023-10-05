import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { theme } from './theme';
import { LogBox } from 'react-native';
import { useDispatch } from 'react-redux';
import { Navigation } from './navigation';
import { connectToProvider } from '@dapp/config/provider';
import { USER_STORE, WALLETS_STORE } from '@dapp/config/constants';
import { getUserDetails } from './services';
import { setHasAccount, setUserDetails, setIsConnected } from './store/essential/essential.slice';
import { updateWalletAddress } from './store/wallet/wallet.slice';
import { setUserTokenFrom } from '@dapp/config/usertoken';
import { setPrivateKey } from '@dapp/config/signer';
import { getWallets } from '@dapp/features/wallet';
import { decryptDataWtoken } from '@dapp/utils';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    //LogBox.ignoreAllLogs();
  }, []);
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
        const wallets = await getWallets();
        if (userDetails.token && wallets.length > 0) {
          setUserTokenFrom(userDetails.token);
          const key = await decryptDataWtoken(wallets[0].enPrivateKey, userDetails.token);
          setPrivateKey(key);
          dispatch(setHasAccount(true)); //Evaluate for stability
          dispatch(
            setUserDetails({
              userNames: userDetails.names,
              phoneNumber: userDetails.phone,
              address: wallets[0].address,
            }),
          );
          dispatch(updateWalletAddress(wallets[0].address));
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
