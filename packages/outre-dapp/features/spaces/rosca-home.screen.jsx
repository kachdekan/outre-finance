import { Box, Text, Icon, FlatList, Spinner } from '@clixpesa/native-base';
import { useState, useCallback, useLayoutEffect, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

import {
  SectionHeader,
  TransactionItem,
  RoscaFeatureCard,
  PotProgressCard,
} from '@dapp/components';
import { roundDetails, transactions, rates } from '@dapp/data';
import { getRoscaData } from '@dapp/store/spaces/spaces.slice';
import { useGetTokenTransfersQuery } from '@dapp/services/blockscout';
import { useSelector, useDispatch } from 'react-redux';
import { utils } from 'ethers';
import { areAddressesEqual, shortenAddress } from '@dapp/utils/addresses';

export default function RoscaHomeScreen({ navigation, route }) {
  const thisRosca = useSelector((s) => s.spaces.thisRosca); //route.params.roscaAddress;
  const dispatch = useDispatch();
  const { roscaDetails } = useSelector((state) => state.spaces);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => {
        return (
          <HeaderBackButton
            {...props}
            onPress={() => {
              navigation.navigate('SpacesLanding', { screen: 'Home' });
            }}
          />
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    dispatch(getRoscaData(thisRosca.roscaAddress));
  }, []);

  const {
    data: txData,
    error: txError,
    isLoading: txIsLoading,
  } = useGetTokenTransfersQuery(thisRosca.roscaAddress);
  const handleGetTransactions = () => {
    const thisTxs = [];
    const goodTxs = Array.prototype.filter.call(
      txData.result,
      (txs) => txs.value.toString() * 1 >= utils.parseEther('0.0008').toString() * 1,
    );
    goodTxs.forEach((tx) => {
      const txDate = new Date(tx.timeStamp * 1000);
      const date = txDate.toDateString().split(' ');
      const txItem = {
        tx: tx.blockNumber,
        credited: areAddressesEqual(tx.to, thisRosca.roscaAddress) ? true : false,
        title: areAddressesEqual(tx.to, thisRosca.roscaAddress)
          ? shortenAddress(tx.from, true)
          : shortenAddress(tx.to, true),
        date: date[0] + ', ' + date[2] + ' ' + date[1] + ', ' + txDate.toTimeString().slice(0, 5),
        amount: utils.formatUnits(tx.value, 'ether'),
        token: tx.tokenSymbol,
      };
      thisTxs.push(txItem);
    });
    setTransactions(thisTxs);
  };

  useEffect(() => {
    if (txData) handleGetTransactions();
  }, [txData]);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    wait(2000).then(async () => {
      setRefreshing(false);
    });
  }, []);

  let totalBalance = 0;
  if (!roscaDetails.roscaBal) {
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
          <Box>
            <RoscaFeatureCard
              color="warmGray.800"
              bg="white"
              balance={(roscaDetails.roscaBal * 1).toFixed(4).toString()}
              apprxBalance={(roscaDetails.roscaBal * 120.75).toFixed(2).toString()}
              btn1={{
                icon: <Icon as={Feather} name="plus" size="md" color="primary.600" mr="1" />,
                name: 'Fund Rosca',
                screen: 'fundRoscaRound',
                screenParams: { roscaAddress: thisRosca.roscaAddress },
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-down" size="md" color="primary.600" mr="1" />,
                name: 'Withdraw',
                screen: 'sendFunds',
              }}
              btn3={{
                icon: <Icon as={Feather} name="more-horizontal" size="lg" color="primary.600" />,
                name: 'More',
                screen: 'DummyModal',
              }}
              itemBottom={false}
            />
            <SectionHeader
              title={'Round No.' + roundDetails.roundNo}
              actionText={
                'For: Dekan' //+ roscaDetails.creator ? roscaDetails.creator.slice(0, 6) : 'Next'
              }
              action={() => console.log('See all')}
            />
            <PotProgressCard
              roundBal={roscaDetails.roscaBal * 1}
              goalAmount={roscaDetails.goalAmount * 1}
              dueDate={roscaDetails.dueDate}
              memberCount={roscaDetails.activeMembers}
              ctbCount={roundDetails.ctbCount}
              myCtb={roundDetails.myContribution}
              token={roundDetails.token}
            />
            {transactions.length > 0 ? (
              <SectionHeader
                title="Transactions"
                actionText="See all"
                action={() => console.log('See all')}
              />
            ) : null}
          </Box>
        }
        renderItem={({ item, index }) => (
          <Box
            bg="white"
            opacity={85}
            roundedTop={index === 0 ? '2xl' : 'md'}
            roundedBottom={index === transactions.length - 1 ? '2xl' : 'md'}
            mt={1}
          >
            <TransactionItem
              key={item.id}
              credited={item.credited}
              trTitle={item.title}
              trDate={item.date}
              spAmount={
                (item.credited ? '+' : '-') + (item.amount * 1).toFixed(2) + ' ' + item.token
              }
              eqAmount={(item.amount * rates[item.token]).toFixed(2) + ' KES'}
              screen="DummyModal"
            />
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
}
