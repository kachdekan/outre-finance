import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider, config, Text } from '@gluestack-ui/themed'


export default function App() {
  return (
    <GluestackUIProvider config={config.theme}>
      <Text>Open up App.js to start working your outre dapp!</Text>
      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
