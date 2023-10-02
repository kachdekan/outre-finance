import {
  Box,
  Text,
  Image,
  HStack,
  Button,
  Spacer,
  VStack,
  Progress,
  Avatar,
  Spinner,
  Icon,
  FlatList,
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TransactionItem, FeaturesCard, SectionHeader } from '@dapp/components';
import { useGetContractTransactionsQuery } from '@dapp/services';
import { utils } from 'ethers';
import { rates } from '../../data';

export default function RoscaHomeScreen({ navigation, route }) {
  const thisAddress = useSelector((s) => s.wallet.walletInfo.address);
  const roscaAddress = route.params.address;
  const [refreshing, setRefreshing] = useState(false);
  const [prog, setProg] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [rosca, setRosca] = useState(route.params);
  const [transactions, setTransactions] = useState([]);
  const isLender = route.params.isLender;

  const { data: contractTxs, refetch: refetchTxs } = useGetContractTransactionsQuery(roscaAddress);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);
  useEffect(() => {
    const getRosca = async () => {
      //const roscaDetails = await getRoscaDetails(route.params.address);
      const roscaDetails = {
        imgLink: 'https://bit.ly/3vJ1yQq',
        roscaBal: 0,
        goalAmount: 100,
        currentRound: 1,
        activeMembers: 5,
        creator: '0x123456789',
        dueDate: '2021-10-10',
      };

      setRosca(roscaDetails);
      setProg((roscaDetails.roscaBal / roscaDetails.goalAmount) * 100);
      setDueAmount((roscaDetails.goalAmount * 1) / (roscaDetails.activeMembers * 1));
    };
    getRosca();
    refetchTxs();
    const unsubscribe = navigation.addListener('focus', () => {
      getRosca();
      refetchTxs();
    });

    return unsubscribe;
  }, [navigation, refreshing]);

  useEffect(() => {
    const getTxs = async () => {
      const thisTxs = await getRoscaTxs(contractTxs, thisAddress);
      setTransactions(thisTxs);
    };
    getTxs();
  }, [contractTxs]);

  if (!rosca) {
    return <Spinner size="lg" />;
  }
  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <FlatList
        width="95%"
        data={transactions}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <Box mt="3">
            <FeaturesCard
              color="warmGray.800"
              bg="white"
              balance={(rosca.roscaBal * 1).toFixed(4).toString()}
              apprxBalance={(rosca.roscaBal * rates.USDD).toFixed(2).toString()}
              expScreen="DummyModal"
              btn1={{
                icon: (
                  <Icon as={Feather} name="arrow-up-right" size="md" color="primary.600" mr="1" />
                ),
                name: 'Fund',
                screen: 'fundSpace',
                screenParams: { roscaAddress, dueAmount },
              }}
              btn2={{
                icon: (
                  <Icon as={Feather} name="arrow-down-right" size="md" color="primary.600" mr="1" />
                ),
                name: 'Withdraw',
                screen: 'DummyModal',
                screenParams: {},
              }}
              btn3={{
                icon: <Icon as={Feather} name="more-horizontal" size="lg" color="primary.600" />,
                name: 'More',
                screen: 'DummyModal',
              }}
              itemBottom={true}
            />

            <Box alignItems="center" mt={3}>
              <HStack mx="8" my="2">
                <Text fontWeight="medium" color="blueGray.600">
                  Round: {rosca.currentRound}
                </Text>
                <Spacer />
                <Text _light={{ color: 'primary.600' }} fontWeight="medium">
                  Due for: {rosca.creator ? rosca.creator.slice(0, 6) : 'Next'}
                </Text>
              </HStack>
              <Box bg="white" roundedTop="xl" roundedBottom="md" width="full">
                <VStack space={2}>
                  <HStack mx="5" my="2">
                    <Text fontWeight="semibold" fontSize="md">
                      Saved: {prog.toFixed(1)}%
                    </Text>
                    <Spacer />
                    <Text _light={{ color: 'muted.500' }} fontWeight="medium" pt={1}>
                      {rosca.roscaBal} / {rosca.goalAmount}
                    </Text>
                  </HStack>
                  <Progress colorScheme="primary" value={prog} mx="4" bg="primary.100" />
                  <HStack mx="5" my="2">
                    <Text fontWeight="medium" color="muted.500">
                      Due: {rosca.dueDate}
                    </Text>
                    <Spacer />
                    <Text _light={{ color: 'muted.500' }} fontWeight="medium">
                      2/5 Contributions
                    </Text>
                  </HStack>
                </VStack>
              </Box>
              <Box bg="white" roundedTop="md" roundedBottom="xl" width="full" mt={1}>
                <HStack mx="5" my="2" pb={1}>
                  <Text fontWeight="medium" fontSize="md" color="blueGray.600">
                    Your Contribution
                  </Text>
                  <Spacer />
                  <Text _light={{ color: 'primary.600' }} fontWeight="medium" py={1}>
                    {rosca.roscaBal}/{(rosca.goalAmount * 1) / (rosca.activeMembers * 1)} USDD
                  </Text>
                </HStack>
              </Box>
            </Box>
            {transactions.length > 0 ? <SectionHeader title="Transactions" /> : null}
          </Box>
        }
        renderItem={({ item, index }) => (
          <Box
            bg="white"
            opacity={85}
            roundedTop={index == 0 ? '2xl' : 'md'}
            roundedBottom={index == transactions.length - 1 ? '2xl' : 'md'}
            mt={1}
          >
            <TransactionItem
              credited={!item.credited}
              trTitle={item.title}
              trDate={item.date}
              spAmount={
                (item.credited ? '+' : '-') + (item.amount * 1).toFixed(2) + ' ' + item.token
              }
              eqAmount={(item.amount * rates.USDD).toFixed(2) + ' KES'}
              screen="DummyModal"
            />
          </Box>
        )}
        keyExtractor={(item) => item.tx}
        ListFooterComponent={<Box height="20px"></Box>}
      />
    </Box>
  );
}
