import { Box, Text, Icon, FlatList, SectionList } from '@clixpesa/native-base';
import { useState, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

import {
  SectionHeader,
  TransactionItem,
  LoansFeatureItem,
  RoscaFeatureCard,
  LoansOfferItem,
  PotProgressCard,
} from '@dapp/components';
import { LoansData, LoanOffers, LoanRequests, transactions, rates } from '@dapp/data';

export default function RoscaHomeScreen() {
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
      <SectionList
        width="95%"
        sections={LoansData}
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
                name: 'Request Loan',
                screen: 'depositFunds',
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-up" size="md" color="primary.600" mr="1" />,
                name: 'Offer Loan',
                screen: 'sendFunds',
              }}
              btn3={{
                icon: <Icon as={Feather} name="more-horizontal" size="lg" color="primary.600" />,
                name: 'More',
                screen: 'DummyModal',
              }}
              itemBottom={false}
            />
          </Box>
        }
        renderSectionHeader={({ section: { title } }) => (
          <SectionHeader
            title={title}
            actionText={'See all'}
            action={() => console.log('See all')}
          />
        )}
        renderItem={({ item, index, section: { title, data } }) => {
          if (title === 'Active Loans') {
            return (
              <Box
                bg="white"
                opacity={85}
                roundedTop={index === 0 ? '2xl' : 'md'}
                roundedBottom={index === data.length - 1 ? '2xl' : 'md'}
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
            );
          } else if (title === 'Loan Offers') {
            return (
              <Box
                bg="white"
                opacity={85}
                mt={1}
                roundedTop={index == 0 ? '2xl' : 'md'}
                roundedBottom={index == data.length - 1 ? '2xl' : 'md'}
              >
                <LoansOfferItem
                  isOffer={true}
                  itemTitle={item.from}
                  type={item.type === 'individual' ? 'Member' : 'Group'}
                  principal={item.lendingPool}
                  interest={item.interest}
                  duration={{
                    min: item.minDuration,
                    max: item.maxDuration,
                  }}
                  limit={{
                    min: item.minAmount,
                    max: item.maxAmount,
                  }}
                  screen="applyLoan"
                  scrnParams={item}
                />
              </Box>
            );
          } else if (title === 'Loan Requests') {
            return (
              <Box
                bg="white"
                opacity={85}
                mt={1}
                roundedTop={index == 0 ? '2xl' : 'md'}
                roundedBottom={index == data.length - 1 ? '2xl' : 'md'}
              >
                <LoansOfferItem
                  isOffer={false}
                  itemTitle={item.from}
                  type={item.type === 'individual' ? 'Member' : 'Group'}
                  principal={item.principal}
                  interest={item.interest}
                  duration={{
                    min: item.minDuration,
                    max: item.maxDuration,
                  }}
                  creditScore={item.creditScore}
                  screen="applyLoan"
                  scrnParams={item}
                />
              </Box>
            );
          }
        }}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
}
