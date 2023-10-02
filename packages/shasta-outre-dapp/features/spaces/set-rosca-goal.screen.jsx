import {
  Box,
  Text,
  VStack,
  Spacer,
  Button,
  Stack,
  HStack,
  Input,
  Pressable,
  Avatar,
  useDisclose,
} from 'native-base';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import {
  setCtbSchedule,
  setDisbSchedule,
  setGoalAmount,
  setUserSpaces,
} from '@dapp/store/spaces/spaces.slice';
import { utils } from 'ethers';
import { ScheduleActSheet, SuccessModal } from '@dapp/components';
import { stableToken } from '@dapp/config';
import { generateId } from '@dapp/utils';

export default function SetRoscaGoalScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const spaceInfo = useSelector((state) => state.spaces.spaceInfo);
  const [authCode, setAuthCode] = useState('');
  const [amount, setAmount] = useState('');
  const { isOpen, onOpen, onClose } = useDisclose();
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclose();
  const [isSetCtb, setIsSetCtb] = useState(false);
  const [schedule, setSchedule] = useState({
    day: spaceInfo.ctbDay,
    occurrence: spaceInfo.ctbOccurence,
  });
  const [isLoading, setIsLoading] = useState(false);
  //const userAddress = useSelector((s) => s.wallet.walletInfo.address)
  const members = useSelector((state) => state.spaces.selectedMembers);

  useEffect(() => {
    setAuthCode(generateId());
  }, []);

  const createRosca = async () => {
    setIsLoading(true);
    const ctbAmount = utils.parseUnits(spaceInfo.ctbAmount.toString(), 18).toString();
    const goalAmount = utils.parseUnits(spaceInfo.goalAmount.toString(), 18).toString();
    try {
      let txData = {
        token: stableToken,
        roscaName: spaceInfo.name,
        imageLink: spaceInfo.imgLink,
        authCode,
        goalAmount,
        ctbAmount,
        ctbDay: spaceInfo.ctbDay,
        ctbOccur: spaceInfo.ctbOccurence,
        disbDay: spaceInfo.disbDay,
        disbOccur: spaceInfo.disbOccurence,
      };
      console.log(txData);
      setIsLoading(false);
      onOpen1();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <VStack space={3}>
        <Text mx={6} mt={8}>
          Set an amount and contribution and disbursment schedule
        </Text>
        <Stack mx={2} space={1}>
          <Box bg="white" roundedTop="xl" roundedBottom="md" borderWidth={1} borderColor="gray.100">
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
                onClose={() => dispatch(setGoalAmount(amount))}
                onSubmitEditing={() => dispatch(setGoalAmount(amount))}
              />
            </HStack>
            <Text px={5} mb={3}>
              Each member contributes:{' '}
              {members.length > 0 ? (amount / (members.length + 1)).toFixed(2).toString() : 'some'}{' '}
              USDD
            </Text>
          </Box>
          <HStack
            bg="white"
            py={3}
            px={4}
            justifyContent="space-between"
            rounded="md"
            borderWidth={1}
            borderColor="gray.100"
          >
            <Text fontSize="md">Contribution Schedule:</Text>
            <Pressable onPress={onOpen} onPressOut={() => setIsSetCtb(true)}>
              {spaceInfo.ctbDay !== 'every' ? (
                <Text color="primary.600" fontSize="md">
                  {spaceInfo.ctbOccurence} on {spaceInfo.ctbDay.slice(0, 3)}
                </Text>
              ) : (
                <Text color="primary.600" fontSize="md">
                  Everyday
                </Text>
              )}
            </Pressable>
          </HStack>
          <HStack
            bg="white"
            p={4}
            pt={3}
            justifyContent="space-between"
            roundedTop="md"
            roundedBottom="xl"
            borderWidth={1}
            borderColor="gray.100"
          >
            <Text fontSize="md">Disbursment Schedule:</Text>
            <Pressable onPress={onOpen} onPressOut={() => setIsSetCtb(false)}>
              {spaceInfo.disbDay !== 'every' ? (
                <Text color="primary.600" fontSize="md">
                  {spaceInfo.disbOccurence} on {spaceInfo.disbDay.slice(0, 3)}
                </Text>
              ) : (
                <Text color="primary.600" fontSize="md">
                  Everyday
                </Text>
              )}
            </Pressable>
          </HStack>
          <Stack py={3} px={4}>
            <Text>Members: You + {members.length}</Text>
            <HStack py={2} space={3}>
              {members.map((member) => {
                return (
                  <SelectedMembers
                    key={member.name}
                    nameInitials={member.name[0].toUpperCase()}
                    name={member.name}
                  />
                );
              })}
            </HStack>
          </Stack>
        </Stack>
        <ScheduleActSheet
          isOpen={isOpen}
          onClose={onClose}
          schedule={schedule}
          setSchedule={setSchedule}
          setCtbSchedule={setCtbSchedule}
          setDisbSchedule={setDisbSchedule}
          isSetCtb={isSetCtb}
        />
        <SuccessModal
          isOpen={isOpen1}
          onClose={onClose1}
          message={`Rosca created successfully! \nInvite Code: ${authCode}`}
          screen="Spaces"
          scrnOptions={{}}
        />
        <Spacer />
        <Stack alignItems="center" space={3} mb={16}>
          <Button
            variant="subtle"
            rounded="3xl"
            bg="primary.100"
            w="60%"
            _text={{ color: 'text.900', fontWeight: 'semibold', mb: '0.5' }}
            onPress={() => {}}
          >
            Skip
          </Button>
          <Button
            isLoading={isLoading}
            isLoadingText="Submitting"
            rounded="3xl"
            w="60%"
            _text={{ color: 'text.50', fontWeight: 'semibold', mb: '0.5' }}
            onPress={() => {
              createRosca();
              /*dispatch(setUserSpaces(userAddress)*/
            }}
          >
            Continue
          </Button>
        </Stack>
      </VStack>
    </Box>
  );
}

function SelectedMembers(props) {
  return (
    <VStack alignItems="center">
      <Avatar bg="primary.200" _text={{ color: 'text.800' }}>
        {props.nameInitials}
      </Avatar>
      <Text fontSize="xs">{props.name}</Text>
    </VStack>
  );
}
