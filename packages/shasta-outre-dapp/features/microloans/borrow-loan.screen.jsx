import {
  Box,
  Text,
  VStack,
  HStack,
  Input,
  Pressable,
  Stack,
  Button,
  Spacer,
  useDisclose,
  Modal,
  Icon,
} from 'native-base';
import { Feather, Ionicons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDaysBetween } from '@dapp/utils';
import { utils } from 'ethers';
import { borrowLoan } from '@dapp/contracts';

export default function BorrowLoanScreen({ navigation, route }) {
  const loanParams = route.params ? route.params.loanParams : null;
  const thisUser = useSelector((state) => state.essential.userDetails);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOkValue, setOkValue] = useState(true);
  const [isOkDeadline, setOkDeadline] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclose();
  const date = deadline.toDateString().split(' ');
  const [errorMessage, setErrorMessage] = useState('');

  const loanData = {
    id: loanParams.id,
    token: loanParams.token,
    lender: loanParams.lenderAddr,
    lenderName: loanParams.lenderName,
    borrower: thisUser.address,
    borrowerName: thisUser.names,
    principal: utils.parseEther(amount ? amount : '0').toString(),
    interest: loanParams.interest * 100,
    balance: utils.parseEther('0').toString(),
    paid: utils.parseEther('0').toString(),
    minDuration: loanParams.minDuration,
    maxDuration: loanParams.maxDuration,
    deadline: Date.parse(deadline),
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDeadline(currentDate);
  };

  const handleDatePicker = () => {
    DateTimePickerAndroid.open({
      value: deadline,
      onChange,
      mode: 'date',
      is24Hour: true,
    });
  };

  const validate = () => {
    const days = getDaysBetween(Date.now(), deadline);
    if (days < loanParams.minDuration || days > loanParams.maxDuration) {
      setOkDeadline(false);
    } else {
      setOkDeadline(true);
    }
    if (loanParams.minAmount > amount * 1 || amount * 1 > loanParams.maxAmount) {
      console.log(amount);
      setOkValue(false);
    } else {
      setOkValue(true);
    }
    return (
      days >= loanParams.minDuration &&
      days <= loanParams.maxDuration &&
      amount * 1 >= loanParams.minAmount &&
      amount * 1 <= loanParams.maxAmount
    );
    //return false
  };

  const handleLoanData = async () => {
    if (validate()) {
      setIsLoading(true);
      const result = await borrowLoan(loanData);
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
    } else console.log('Loan Data is not valid');
  };

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <VStack space={3} width="95%">
        <Stack mx={6} mt={8}>
          <Text>Set an amount and deadline for your loan</Text>
          {loanParams.lender ? (
            <Text fontSize="md">
              Limit: {(loanParams.minLimit * 1).toFixed(2)} - {(loanParams.maxLimit * 1).toFixed(2)}{' '}
              USDD
            </Text>
          ) : (
            <Text fontSize="md">Duration: 2 - 3 weeks</Text>
          )}
        </Stack>
        <Stack space={1}>
          {loanParams.lenderAddr ? (
            <Box bg="white" roundedTop="xl" roundedBottom="md">
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
                Max Borrowable: {(loanParams.maxAmount * 1).toFixed(2)} USDD
              </Text>
            </Box>
          ) : null}
          <HStack
            bg="white"
            py={3}
            px={4}
            justifyContent="space-between"
            roundedTop={loanParams.lender ? '2xl' : 'md'}
            roundedBottom="2xl"
          >
            <Text fontSize="md">Deadline:</Text>
            <Pressable onPress={() => handleDatePicker()}>
              <HStack space={2}>
                <Text color="primary.600" fontSize="md">
                  {date[2]
                    ? date[0] + ', ' + date[2] + ' ' + date[1] + ' ' + date[3]
                    : date[0] + ', ' + date[3] + ' ' + date[1] + ' ' + date[5]}
                </Text>
                <Icon as={Feather} name="calendar" color="primary.600" size="lg" />
              </HStack>
            </Pressable>
          </HStack>
        </Stack>
        <Stack>
          <Text mx={6} mb={2}>
            Loan Details
          </Text>
          <VStack space={1}>
            <VStack bg="white" roundedTop="xl" roundedBottom="md" space={1}>
              <HStack justifyContent="space-between" pt={3} px={4}>
                <Text fontWeight="medium">Lender:</Text>
                <Text>{loanParams.lenderName}</Text>
              </HStack>
              <HStack justifyContent="space-between" px={4}>
                <Text fontWeight="medium">Interest:</Text>
                <Text>{loanParams.interest}% (45% APR)</Text>
              </HStack>
              <HStack justifyContent="space-between" px={4}>
                <Text fontWeight="medium">Duration:</Text>
                <Text>
                  {loanParams.minDuration / 7} - {loanParams.maxDuration / 7} weeks
                </Text>
              </HStack>
              <HStack justifyContent="space-between" px={4}>
                <Text fontWeight="medium">Principal:</Text>
                <Text>≈ {(amount * 120.75).toFixed(2)} KES</Text>
                <HStack alignItems="center" space={2}>
                  {isOkValue ? null : <Icon as={Feather} name="alert-circle" color="danger.500" />}
                  <Text color={isOkValue ? null : 'danger.500'}>
                    {(amount * 1).toFixed(2)} USDD
                  </Text>
                </HStack>
              </HStack>
              <HStack justifyContent="space-between" px={4}>
                <Text fontWeight="medium">Repayment:</Text>
                <Text>≈ {((amount * 120.75 * (100 + 5)) / 100).toFixed(2)} KES</Text>
                <Text>{((amount * 1 * (100 + 5)) / 100).toFixed(2)} USDD</Text>
              </HStack>
              <HStack justifyContent="space-between" pb={3} px={4}>
                <Text fontWeight="medium">Repayment Date:</Text>
                <HStack alignItems="center" space={2}>
                  {isOkDeadline ? null : (
                    <Icon as={Feather} name="alert-circle" color="danger.500" />
                  )}
                  <Text color={isOkDeadline ? null : 'danger.500'}>
                    {date[2]
                      ? date[0] + ', ' + date[2] + ' ' + date[1] + ' ' + date[3]
                      : date[0] + ', ' + date[3] + ' ' + date[1] + ' ' + date[5]}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
            <HStack
              bg="white"
              py={3}
              px={4}
              justifyContent="space-between"
              roundedTop="md"
              roundedBottom="2xl"
            >
              <Text fontSize="md">Loan terms and Conditions:</Text>
              <Pressable onPress={() => handleDatePicker()}>
                <HStack space={2}>
                  <Text color="primary.600" fontSize="md">
                    Show
                  </Text>
                  <Icon as={Feather} name="chevron-down" color="primary.600" size="lg" />
                </HStack>
              </Pressable>
            </HStack>
          </VStack>
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
                  You have initiated a loan of
                </Text>
                <Text textAlign="center" fontWeight="semibold">
                  {(amount * 1).toFixed(2)} USDD
                </Text>
                <Text textAlign="center">from {loanParams.lenderName}</Text>
              </>
            ) : (
              <>
                <Text textAlign="center" mt={3}>
                  Something went wrong. Please try again.{' '}
                </Text>
                <Text textAlign="center" fontWeight="semibold">
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
                onClose();
                navigation.navigate('Loans');
              }}
            >
              OK
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Spacer />
      <Stack alignItems="center" space={3} mb={8} width="95%">
        <Button
          isLoading={isLoading}
          isLoadingText="Submitting"
          rounded="3xl"
          w="60%"
          _text={{ color: 'primary.100', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => {
            handleLoanData();
          }}
        >
          Continue
        </Button>
      </Stack>
    </Box>
  );
}
