import {
  Box,
  Text,
  VStack,
  Stack,
  HStack,
  Input,
  Spacer,
  Button,
  Modal,
  Icon,
  useDisclose,
} from 'native-base';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { getUSDDBalance, fundSpace } from '@dapp/contracts';

export default function FundSpaceScreen({ navigation, route }) {
  const thisAddress = useSelector((s) => s.wallet.walletInfo.address);
  const [amount, setAmount] = useState('');
  const { isOpen, onOpen, onClose } = useDisclose();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [balance, setBalance] = useState(0);
  const handleFundSpace = async () => {
    console.log('Funding Rosca...');
    setIsLoading(true);
    const result = await fundSpace(route.params.roscaAddress, amount);
    if (result) {
      if (Array.isArray(result)) {
        setIsSuccess(true);
        setIsLoading(false);
        onOpen();
      } else {
        setIsSuccess(false);
        setIsLoading(false);
        setErrorMessage(result);
        onOpen();
      }
    } else {
      setIsSuccess(false);
      setIsLoading(false);
      onOpen();
    }
  };

  useEffect(() => {
    const getBalance = async () => {
      const bal = await getUSDDBalance(thisAddress);
      setBalance(bal);
    };
    getBalance();
  }, []);

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <VStack space={3} width="95%">
        <Stack mx={6} mt={8}>
          <Text>Set an amount you wish to pay</Text>
          <Text fontSize="md">Pay a max of: {(route.params.dueAmount * 1).toFixed(4)} USDD</Text>
        </Stack>
        <Stack bg="white" rounded="2xl">
          <HStack m={3} space="xl">
            <Text fontSize="lg" py={3} pl={4} fontWeight="semibold">
              USDD
            </Text>
            <Input
              py={2}
              textAlign="right"
              minW="2/3"
              placeholder="0.00"
              size="lg"
              keyboardType="numeric"
              InputRightElement={
                <Text fontSize="md" fontWeight="medium" pr={3}>
                  USDD
                </Text>
              }
              value={amount}
              onChangeText={(amount) => setAmount(amount)}
            />
          </HStack>
          <Text px={5} mb={3}>
            Account Balance: {(balance * 1.0).toFixed(2)} USDD
          </Text>
        </Stack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} animationPreset="slide">
        <Modal.Content width="65%" maxWidth="400px">
          <Modal.Body alignItems="center">
            <Icon
              as={Ionicons}
              name={isSuccess ? 'md-checkmark-circle' : 'close-circle'}
              size="6xl"
              color={isSuccess ? 'success.600' : 'danger.600'}
            />
            {isSuccess ? (
              <>
                <Text textAlign="center" mt={3}>
                  Rosca has been funded successfully!
                </Text>
                <Text textAlign="center" fontWeight="medium" mt={2}>
                  + {(amount * 1).toFixed(2)} USDD
                </Text>
              </>
            ) : (
              <>
                <Text textAlign="center" mt={3}>
                  Rosca funding FAILED!
                </Text>
                <Text textAlign="center" fontWeight="medium" mt={2}>
                  {errorMessage}
                </Text>
              </>
            )}

            <Button
              variant="subtle"
              rounded="3xl"
              w="60%"
              mt={3}
              _text={{ color: 'primary.600', fontWeight: 'semibold' }}
              onPress={() => {
                onClose(), isSuccess ? navigation.goBack() : null;
              }}
            >
              OK
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Spacer />
      <Stack alignItems="center" mb={8} width="95%">
        <Button
          isLoading={isLoading}
          isLoadingText="Sending..."
          rounded="3xl"
          w="60%"
          _text={{ color: 'primary.100', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => {
            handleFundSpace();
          }}
        >
          Continue
        </Button>
      </Stack>
    </Box>
  );
}
