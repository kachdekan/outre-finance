import { Box, Text } from '@gluestack-ui/themed';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AuthStack = createNativeStackNavigator();

const AccountScreen = () => {
  return (
    <Box flex={1} bg="$primary100" alignItems="center" justifyContent="center">
      <Text size="xl">Auth Screen!</Text>
    </Box>
  );
};

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Main" component={AccountScreen} />
    </AuthStack.Navigator>
  );
};
