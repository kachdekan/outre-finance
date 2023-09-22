import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState} from 'react';
import { theme } from './theme';
import { LogBox } from 'react-native';
import { useDispatch } from 'react-redux';
import { Navigation } from './navigation';
import { USER_STORE, WALLETS_STORE } from '@dapp/config';
import { getUserDetails } from './services';
import { setHasAccount, setUserDetails } from './redux/essential/essential.slice';
import { setUserTokenFrom } from './features/essentials/user.token';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary and is a noop. ...'])
    //LogBox.ignoreAllLogs();
  }, []);
   // Load resources during splash screen
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
         SplashScreen.preventAutoHideAsync();
         const userDetails = await getUserDetails(USER_STORE);
          if (userDetails.token) {
          setUserTokenFrom(userDetails.token);
          dispatch(setHasAccount(true)) //Evaluate for stability
          dispatch(
            setUserDetails({ userNames: userDetails.names, phoneNumber: userDetails.phone }),
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
      <Navigation/>
      <StatusBar style="auto" />
    </NativeBaseProvider>
  );
}
}
