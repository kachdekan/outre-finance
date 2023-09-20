import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { useEffect } from 'react';
import { theme } from './theme';
import { LogBox } from 'react-native';

import { Navigation } from './navigation';

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary and is a noop. ...'])
    //LogBox.ignoreAllLogs();
  }, []);
  return (
    <NativeBaseProvider theme={theme}>
      <Navigation/>
      <StatusBar style="auto" />
    </NativeBaseProvider>
  );
}
