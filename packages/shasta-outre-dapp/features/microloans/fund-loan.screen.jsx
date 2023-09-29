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
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

export default function FundLoanScreen({ navigation }) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');
  const { isOpen, onOpen, onClose } = useDisclose();
  const [isLoading, setIsLoading] = useState(false);
  const [balances, setBalances] = useState(0);

  const handleFundLoan = () => {
    console.log('Funding loan...');
    onOpen();
  };

  const loanParams = {
    id: 1,
    from: 'John Doe',
    type: 'individual',
    lendingPool: 'USDD',
    interest: '5%',
    minDuration: '3 months',
    maxDuration: '6 months',
    minAmount: '100',
    maxAmount: '1000',
    balance: '1000',
  };

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <VStack space={3} width="95%">
        <Stack mx={6} mt={8}>
          <Text>Set an amount you wish to pay</Text>
          <Text fontSize="md">Pay a max of: {(loanParams.balance * 1).toFixed(4)} USDD</Text>
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
            Account Balance: {(balances * 1.0).toFixed(2)} USDD
          </Text>
        </Stack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} animationPreset="slide">
        <Modal.Content width="65%" maxWidth="400px">
          <Modal.Body alignItems="center">
            <Icon as={Ionicons} name="md-checkmark-circle" size="6xl" color="success.600" />
            <Text textAlign="center" mt={3}>
              Loan has been funded successfully!
            </Text>
            <Text textAlign="center" fontWeight="medium" mt={2}>
              + {(amount * 1).toFixed(2)} USDD
            </Text>
            <Button
              variant="subtle"
              rounded="3xl"
              w="60%"
              mt={3}
              _text={{ color: 'primary.600', fontWeight: 'semibold' }}
              onPress={() => {
                onClose(), handleLoanUpdate(), navigation.goBack();
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
            handleFundLoan();
          }}
        >
          Continue
        </Button>
      </Stack>
    </Box>
  );
}
