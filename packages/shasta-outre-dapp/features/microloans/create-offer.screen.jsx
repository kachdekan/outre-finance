import {
  Box,
  Text,
  VStack,
  HStack,
  Input,
  Pressable,
  Stack,
  Button,
  useDisclose,
  Icon,
  Modal,
} from 'native-base';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { getDaysBetween } from '@dapp/utils';
import { useSelector, useDispatch } from 'react-redux';

export default function CreateOfferScreen() {
  const dispatch = useDispatch();
  const thisUser = useSelector((s) => s.essential.userDetails);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState({ min: '', max: '' });
  const [limit, setLimit] = useState({ min: '', max: '' });
  const [interest, setInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [offerID, setOfferID] = useState('');
  const { isOpen, onOpen, onClose } = useDisclose();
  const [isOkValue, setOkValue] = useState(true);
  const [isOkDeadline, setOkDeadline] = useState(true);
  const [balances, setBalances] = useState(0);

  const offerData = {
    id: offerID,
    amount: amount,
    lender: thisUser.address,
    lenderName: thisUser.name,
    principal: amount,
    minLimit: limit.min,
    maxLimit: limit.max,
    interest: interest,
    minDuration: duration.min,
    maxDuration: duration.max,
  };

  const validate = (loanData) => {
    const minDays = 14;
    const maxDays = 21;
    const days = getDaysBetween(Date.now(), loanData.deadline);
    if (days < minDays || days > maxDays) {
      setOkDeadline(false);
    } else {
      setOkDeadline(true);
    }
    if (amount < 50 || amount > 300) {
      setOkValue(false);
      console.log('is Less');
    } else {
      setOkValue(true);
    }
    return true;
  };

  const handleOfferData = () => {
    console.log('Offer Data');
    onOpen();
  };
  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <>
        <VStack space={3}>
          <Stack mx={6} mt={8}>
            <Text>Set an amount, duration, interest and limit for your loan</Text>
          </Stack>
          <Stack space={1}>
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
                Max Lendable: {(balances * 1.0).toFixed(2)} USDD
              </Text>
            </Box>
            <Stack bg="white" py={3} px={4} rounded="md">
              <HStack justifyContent="space-between">
                <Text fontSize="md">Duration</Text>
                <Pressable onPress={() => {}}>
                  <HStack space={2}>
                    <Text color="primary.600" fontSize="md">
                      Weeks
                    </Text>
                    <Icon as={Feather} name="chevron-down" color="primary.600" size="lg" />
                  </HStack>
                </Pressable>
              </HStack>
              <HStack mt={2} justifyContent="space-between" alignItems="center">
                <Input
                  py={1}
                  textAlign="right"
                  placeholder="min"
                  width="45%"
                  size="lg"
                  keyboardType="numeric"
                  value={duration.min}
                  onChangeText={(text) => setDuration({ ...duration, min: text })}
                />
                <Text fontSize="lg"> - </Text>
                <Input
                  py={1}
                  textAlign="right"
                  placeholder="max"
                  width="45%"
                  size="lg"
                  keyboardType="numeric"
                  value={duration.max}
                  onChangeText={(text) => setDuration({ ...duration, max: text })}
                />
              </HStack>
            </Stack>
            <Stack bg="white" py={3} px={4} rounded="md">
              <HStack justifyContent="space-between">
                <Text fontSize="md">Limit</Text>

                <Text fontSize="md" mr={3}>
                  USDD
                </Text>
              </HStack>
              <HStack mt={2} justifyContent="space-between" alignItems="center">
                <Input
                  py={1}
                  textAlign="right"
                  placeholder="min"
                  width="45%"
                  size="lg"
                  keyboardType="numeric"
                  InputRightElement={<Text pr={3}>USDD</Text>}
                  value={limit.min}
                  onChangeText={(amount) => setLimit({ ...limit, min: amount })}
                />
                <Text fontSize="lg"> - </Text>
                <Input
                  py={1}
                  textAlign="right"
                  placeholder="max"
                  width="45%"
                  size="lg"
                  keyboardType="numeric"
                  InputRightElement={<Text pr={3}>USDD</Text>}
                  value={limit.max}
                  onChangeText={(amount) => setLimit({ ...limit, max: amount })}
                />
              </HStack>
            </Stack>
            <Stack bg="white" py={3} px={4} roundedTop="md" roundedBottom="2xl">
              <HStack justifyContent="space-between">
                <Text fontSize="md">Interest</Text>

                <Text fontSize="md" mr={3}>
                  %
                </Text>
              </HStack>
              <HStack mt={2} justifyContent="space-between" alignItems="center">
                <Text>Repayment: {(amount * 1 * (100 + interest * 1)) / 100} USDD</Text>
                <Input
                  py={1}
                  textAlign="right"
                  placeholder="0.00"
                  width="45%"
                  size="lg"
                  keyboardType="numeric"
                  value={interest}
                  onChangeText={(value) => setInterest(value)}
                />
              </HStack>
            </Stack>
          </Stack>
        </VStack>
        <Modal isOpen={isOpen} onClose={onClose} animationPreset="slide">
          <Modal.Content width="65%" maxWidth="400px">
            <Modal.Body alignItems="center">
              <Icon as={Ionicons} name="md-checkmark-circle" size="6xl" color="success.600" />
              <Text textAlign="center" mt={3}>
                Offer number {offerID.toUpperCase()} created successfully!
              </Text>
              <Button
                variant="subtle"
                rounded="3xl"
                w="60%"
                mt={3}
                _text={{ color: 'primary.600', fontWeight: 'semibold' }}
                onPress={() => {
                  onClose(), dispatch(fetchOffers()), navigation.navigate('Offers');
                }}
              >
                OK
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </>
      <Stack position="absolute" bottom={8} alignItems="center" space={3} width="95%">
        <Button
          isLoading={isLoading}
          isLoadingText="Submitting"
          rounded="3xl"
          w="60%"
          _text={{ color: 'primary.100', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => {
            handleOfferData();
          }}
        >
          Continue
        </Button>
      </Stack>
    </Box>
  );
}
