import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
import 'react-native-get-random-values';
import '@ethersproject/shims';

import App from './App';
import { store } from './store';

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(ReduxApp);
