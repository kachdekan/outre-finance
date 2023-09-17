import { Box, Text } from 'native-base';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AccountStack = createNativeStackNavigator();

const AccountScreen = () => {
  return (
    <Box flex={1} bg="muted.100" alignItems="center" justifyContent="center">
      <Text>Account Screen</Text>
    </Box>
  );
};

export const AccountNavigator = () => {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AccountStack.Screen name="Main" component={AccountScreen} />
    </AccountStack.Navigator>
  );
};
