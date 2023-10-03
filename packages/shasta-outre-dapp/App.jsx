import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { theme } from './theme';
import { LogBox } from 'react-native';
import { useDispatch } from 'react-redux';
import { Navigation } from './navigation';
import { USER_STORE, WALLETS_STORE } from '@dapp/config';
import { getUserDetails } from './services';
import { setHasAccount, setUserDetails } from './redux/essential/essential.slice';
import { updateWalletAddress } from './redux/wallet/wallet.slice';
import { setUserTokenFrom } from './features/essentials/user.token';
import { setPrivateKey } from '@dapp/config';
import { getWallets } from '@dapp/features/wallet';
import { decryptDataWtoken } from '@dapp/utils';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    LogBox.ignoreAllLogs();
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
