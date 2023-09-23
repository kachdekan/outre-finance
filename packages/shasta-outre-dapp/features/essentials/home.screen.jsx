import { Box, Text, Button } from 'native-base';
import { createRandom } from 'tronweb';

export default function HomeScreen() {
  const handleOnPress = () => {
    const wallet = createRandom();
    console.log(wallet);
  }
  return (
    <Box flex={1} bg="muted.100" alignItems="center" justifyContent="center">
      <Text>Home Screen</Text>
      <Button onPress={() => handleOnPress()}>Create a wallet</Button>
    </Box>
  );
}
