import {
  Box,
  Text,
  Icon,
  HStack,
  VStack,
  Avatar,
  Stack,
  Pressable,
  ScrollView,
} from '@clixpesa/native-base';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { RefreshControl } from 'react-native';

import { useDispatch } from 'react-redux';
import { fetchSpaces, setUserSpaces, updateSpaces } from '@dapp/store/spaces/spaces.slice';
import { smartContractCall } from '@dapp/blockchain/blockchainHelper';
import { getSpaces } from './spaces.manager';

import { FeatureHomeCard } from '@dapp/components';

export default function SpacesHomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [groups, setGroups] = useState([]);
  const [personal, setPersonal] = useState([]);

  let totalBalance = 0;
  let groupsBal = 0;
  let challengesBal = 0;
  let personalBal = 0;

  useEffect(() => {
    const fetchMySpaces = async () => {
      console.log('fetching my spaces');
      const mySpaces = await smartContractCall('Spaces', {
        method: 'getMySpaces',
        methodType: 'read',
      });
      const results = await getSpaces();
      console.log(results);
      setSpaces(results);
      dispatch(setUserSpaces(results));
      const roscas = results.filter((s) => s.type === 'rosca');
      setGroups(roscas);
      const personal = results.filter((s) => s.type === 'personal');
      setPersonal(personal);
      const challenges = results.filter((s) => s.type === 'challenge');
      setChallenges(challenges);
      for (const idx in mySpaces) {
        if (!results.find((ln) => ln.address === mySpaces[idx][0])) {
          //console.log(mySpaces[idx])
          dispatch(fetchSpaces());
          return;
        }
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchMySpaces();
    });

    return unsubscribe;
  }, [navigation]);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  /*
  useEffect(() => {
    dispatch(fetchSpaces())
  }, []) */

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(fetchSpaces());
    wait(2000).then(async () => {
      const results = await getSpaces();
      setSpaces(results);
      dispatch(setUserSpaces(results));
      const roscas = results.filter((s) => s.type === 'rosca');
      setGroups(roscas);
      const personal = results.filter((s) => s.type === 'personal');
      setPersonal(personal);
      const challenges = results.filter((s) => s.type === 'challenge');
      setChallenges(challenges);
      setRefreshing(false);
    });
  }, []);

  if (spaces.length > 0) {
    spaces.forEach((space) => {
      totalBalance += space.repaid * 1;
    });
    wait(1000).then(() => dispatch(updateSpaces()));
  }
  //Calc segmented balances
  if (groups.length > 0) {
    groups.forEach((space) => {
      groupsBal += space.repaid * 1;
    });
  }
  if (challenges.length > 0) {
    challenges.forEach((space) => {
      challengesBal += space.repaid * 1;
    });
  }
  if (personal.length > 0) {
    personal.forEach((space) => {
      personalBal += space.repaid * 1;
    });
  }

  console.log('spaces', spaces);

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Box flex={1} px={2} mt="4">
        <FeatureHomeCard
          bg="white"
          balance={totalBalance.toFixed(4).toString()}
          apprxBalance={(totalBalance * 120.75).toFixed(2).toString()}
          btn1={{
            icon: <Icon as={Feather} name="plus" size="md" color="primary.600" mr="1" />,
            name: 'New Space',
            screen: 'createSpace',
          }}
          btn2={{
            icon: <Icon as={Feather} name="arrow-up-right" size="md" color="primary.600" mr="1" />,
            name: 'Fund',
            screen: 'DummyModal',
          }}
          btn3={{
            icon: <Icon as={Feather} name="more-horizontal" size="lg" color="primary.600" />,
            name: 'More',
            screen: 'DummyModal',
          }}
          itemBottom={false}
        />

        <HStack justifyContent="space-between" my={4}>
          <Pressable
            width="48%"
            onPress={() => navigation.navigate('SpacesLanding', { screen: 'Personal' })}
          >
            <VStack bg="white" space="6" p={4} borderRadius="2xl">
              <HStack justifyContent="space-between" alignItems="center">
                <Avatar bg="teal.500">
                  <Icon as={MaterialIcons} name="lock-clock" size="xl" color="text.50" />
                </Avatar>
                <VStack>
                  <Text fontSize="md" alignSelf="flex-end">
                    ${personalBal.toFixed(2)}
                  </Text>
                  <Text alignSelf="flex-end">≈ ks{(personalBal * 120.75).toFixed(0)}</Text>
                </VStack>
              </HStack>
              <Stack>
                <Text fontSize="md" fontWeight="medium">
                  Personal
                </Text>
                <Text color="muted.500">Save for a goal</Text>
              </Stack>
            </VStack>
          </Pressable>
          <Pressable
            width="48%"
            onPress={() => navigation.navigate('SpacesLanding', { screen: 'Challenges' })}
          >
            <VStack bg="white" space="6" p={4} borderRadius="2xl">
              <HStack justifyContent="space-between" alignItems="center">
                <Avatar bg="violet.500">
                  <Icon as={MaterialIcons} name="bubble-chart" size="2xl" color="text.50" />
                </Avatar>
                <VStack>
                  <Text fontSize="md" alignSelf="flex-end">
                    ${challengesBal.toFixed(2)}
                  </Text>
                  <Text alignSelf="flex-end">≈ ks{(challengesBal * 120.75).toFixed(0)}</Text>
                </VStack>
              </HStack>
              <Stack>
                <Text fontSize="md" fontWeight="medium">
                  Challenges
                </Text>
                <Text color="muted.500">Be competitive</Text>
              </Stack>
            </VStack>
          </Pressable>
        </HStack>
        <HStack justifyContent="space-between" mb={4}>
          <Pressable
            width="48%"
            onPress={() => navigation.navigate('SpacesLanding', { screen: 'Groups' })}
          >
            <VStack bg="white" space="6" p={4} borderRadius="2xl">
              <HStack justifyContent="space-between" alignItems="center">
                <Avatar bg="green.500">
                  <Icon as={MaterialIcons} name="groups" size="xl" color="text.50" />
                </Avatar>
                <VStack>
                  <Text fontSize="md" alignSelf="flex-end">
                    ${groupsBal.toFixed(2)}
                  </Text>
                  <Text alignSelf="flex-end">≈ ks{(groupsBal * 120.75).toFixed(0)}</Text>
                </VStack>
              </HStack>
              <Stack>
                <Text fontSize="md" fontWeight="medium">
                  Groups
                </Text>
                <Text color="muted.500">Save with friends</Text>
              </Stack>
            </VStack>
          </Pressable>
          <Pressable width="48%" onPress={() => navigation.navigate('DummyModal')}>
            <VStack bg="white" space="6" p={4} borderRadius="2xl">
              <HStack justifyContent="space-between" alignItems="center">
                <Avatar bg="yellow.500">
                  <Icon as={MaterialIcons} name="group-add" size="xl" color="text.50" />
                </Avatar>
                <Text fontSize="md">0</Text>
              </HStack>
              <Stack>
                <Text fontSize="md" fontWeight="medium">
                  Invites
                </Text>
                <Text color="muted.500">Join your crew</Text>
              </Stack>
            </VStack>
          </Pressable>
        </HStack>
      </Box>
    </ScrollView>
  );
}
