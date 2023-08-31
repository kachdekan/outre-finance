import { Box, Text, Icon, FlatList } from '@clixpesa/native-base';
import { useState, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

import {
  SectionHeader,
  TransactionItem,
  RoscaFeatureCard,
  PocketsFeatureItem,
} from '@dapp/components';
import { roundDetails, transactions, rates, pockets } from '@dapp/data';

export default function ChallengesHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
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
  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <FlatList
        width="95%"
        data={pockets}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <Box>
            <RoscaFeatureCard
              color="warmGray.800"
              bg="white"
              balance={totalBalance.toFixed(4).toString()}
              apprxBalance={(totalBalance * 120.75).toFixed(2).toString()}
              btn1={{
                icon: <Icon as={Feather} name="plus" size="md" color="primary.600" mr="1" />,
                name: 'New Challenge',
                screen: 'depositFunds',
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-right" size="md" color="primary.600" mr="1" />,
                name: 'Join Challenge',
                screen: 'sendFunds',
              }}
              btn3={{
                icon: <Icon as={Feather} name="more-horizontal" size="lg" color="primary.600" />,
                name: 'More',
                screen: 'DummyModal',
              }}
              itemBottom={false}
            />
            {transactions.length > 0 ? (
              <SectionHeader
                title="Pockets"
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
            roundedBottom={index === pockets.length - 1 ? '2xl' : 'md'}
            mt={1}
          >
            <PocketsFeatureItem
              inititated={item.inititated}
              itemTitle={item.name}
              payProgress={
                (item.balance * 1).toFixed(2).toString() +
                '/' +
                (item.goal * 1).toFixed(2).toString() +
                ' Paid'
              }
              dueDate={item.dueDate}
              value={(item.goal * 1).toFixed(2).toString() + ' cUSD'}
              screen="Challenges"
              itemParams={{ item }}
            />
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
}
