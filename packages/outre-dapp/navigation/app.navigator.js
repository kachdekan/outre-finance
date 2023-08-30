import { Box, Text } from '@clixpesa/native-base';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AppStack = createNativeStackNavigator();

const AccountScreen = () => {
  return (
    <Box flex={1} bg="$primary100" alignItems="center" justifyContent="center">
      <Text size="xl">App Screen!</Text>
    </Box>
  );
};

export const AppNavigator = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppStack.Screen name="Main" component={AccountScreen} />
    </AppStack.Navigator>
  );
};
