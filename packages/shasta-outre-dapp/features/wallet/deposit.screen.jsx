import { Box, Text, VStack, Divider, HStack, Icon, Pressable, Spacer, Button } from 'native-base';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

export default function DepositScreen() {
  const walletAddress = useSelector((s) => s.wallet.walletInfo.address);
  return (
    <Box flex={1} bg="muted.50" alignItems="center">
      <Pressable>
        <HStack alignItems="center" m={2}>
          <Text fontWeight="medium" fontSize="lg" mr={1}>
            Deposit TRX/USDD
          </Text>
          <Icon as={Ionicons} name="caret-down-outline" size="sm" color="text.400" />
        </HStack>
      </Pressable>
      <Box alignSelf="center" alignItems="center" p={3} bg="white" minW="40%" rounded={16}>
        <QRCode value={walletAddress} size={150} />
        <Text mt={2} alignSelf="center" fontWeight="medium">
          $Akimbo6856
        </Text>
      </Box>
      <VStack width="95%" bg="white" mt={3} rounded="2xl">
        <Divider width="85%" alignSelf="center" />
        <HStack p={3} justifyContent="space-between" justifyItems="center">
          <Box width="70%">
            <Text color="text.600">Wallet Address</Text>
            <Text fontWeight="medium">{walletAddress}</Text>
          </Box>
          <Pressable p={3} mt={4}>
            <Icon as={Ionicons} name="ios-copy-outline" size="lg" color="text.400" />
          </Pressable>
        </HStack>
        <HStack p={3} justifyContent="space-between" justifyItems="center">
          <Box width="70%">
            <Text color="text.600">Network</Text>
            <Text fontWeight="medium">SHASTA Testnet (TRX & TRC20)</Text>
          </Box>
          <Pressable p={3}>
            <Icon as={Ionicons} name="md-swap-horizontal" size="lg" color="text.400" />
          </Pressable>
        </HStack>
        <Divider width="85%" alignSelf="center" />
        <Box pl={3} py={3} pr={6}>
          <HStack justifyContent="space-between">
            <Text>Minimum deposit</Text>
            <Text fontWeight="medium">1.00 USDD OR TRX</Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text>Expected arrival</Text>
            <Text fontWeight="medium">12 block confirmations</Text>
          </HStack>
        </Box>
      </VStack>
      <Spacer />
      <HStack space={3} bottom="10">
        <Button
          variant="subtle"
          bg="primary.100"
          rounded="3xl"
          pr="4"
          minW="40%"
          _text={{ color: 'primary.700', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => console.log('Share image')}
        >
          Save Image
        </Button>
        <Button
          rounded="3xl"
          pr="4"
          minW="40%"
          _text={{ color: 'primary.100', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => console.log('Share Address')}
        >
          Share Address
        </Button>
      </HStack>
    </Box>
  );
}
