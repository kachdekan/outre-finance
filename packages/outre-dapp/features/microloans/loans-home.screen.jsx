import { Box, Text, HStack, Icon, FlatList } from 'native-base';
import { useState, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

import { SectionHeader, LoansFeatureItem, FeatureHomeCard } from '@dapp/components';
import { rates, LoansData } from '@dapp/data';

export default function SpacesHomeScreen() {
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
  const loans = LoansData[0].data;
  let totalBalance = 0;
  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <FlatList
        width="95%"
        data={loans}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <Box mt="3">
            <FeatureHomeCard
              color="warmGray.800"
              bg="white"
              balance={totalBalance.toFixed(4).toString()}
              apprxBalance={(totalBalance * 120.75).toFixed(2).toString()}
              btn1={{
                icon: <Icon as={Feather} name="plus" size="md" color="primary.600" mr="1" />,
                name: 'Borrow',
                screen: 'depositFunds',
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-right" size="md" color="primary.600" mr="1" />,
                name: 'Repay',
                screen: 'sendFunds',
              }}
              btn3={{
                icon: <Icon as={Feather} name="more-horizontal" size="lg" color="primary.600" />,
                name: 'More',
                screen: 'DummyModal',
              }}
              itemBottom={false}
            />
            {loans.length > 0 ? (
              <SectionHeader
                title="Loans"
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
            roundedBottom={index === loans.length - 1 ? '2xl' : 'md'}
            mt={1}
          >
            <LoansFeatureItem
              isLender={item.isLender}
              itemTitle={item.name}
              payProgress={
                item.isPending
                  ? item.isLender
                    ? 'Please fund loan'
                    : 'Waiting for funds'
                  : (item.paid * 1).toFixed(2).toString() +
                    ' / ' +
                    (item.principal * 1).toFixed(2).toString() +
                    ' Paid'
              }
              value={(item.currentBal * 1).toFixed(2).toString() + ' ' + item.token}
              dueDate={item.dueDate}
              screen="LoanHome"
              itemParams={item}
            />
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
}
