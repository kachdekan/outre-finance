import { Box, Text, Icon, VStack, HStack, Spacer, Progress, FlatList, Button } from 'native-base';
import { useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { FeaturesCard } from '@dapp/components';
import { Feather } from '@expo/vector-icons';
import { SectionHeader, TransactionItem } from '@dapp/components';

import { LoansData, transactions } from '../../data';

const loan = LoansData[0].data[0];

export default function LoanInfoScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [prog, setProg] = useState(0);
  const [daysTo, setDaysTo] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    //dispatch(updateLoans());
    //refetch();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <FlatList
        width="95%"
        data={transactions}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Box mt="3">
            <FeaturesCard
              color="warmGray.800"
              bg="white"
              balance={(loan.currentBal * 1).toFixed(4).toString()}
              apprxBalance={(loan.currentBal * 120.75).toFixed(2).toString()}
              expScreen="DummyModal"
              btn1={{
                icon: (
                  <Icon as={Feather} name="arrow-up-right" size="md" color="primary.600" mr="1" />
                ),
                name: loan.initiated ? 'Fund' : 'Repay',
                screen: 'fundLoan',
                screenParams: loan,
              }}
              btn2={{
                icon: <Icon as={Feather} name="list" size="md" color="primary.600" mr="1" />,
                name: 'Details',
                screen: 'LoanDetails',
                screenParams: loan,
              }}
              btn3={{
                icon: <Icon as={Feather} name="more-horizontal" size="lg" color="primary.600" />,
                name: 'More',
                screen: 'DummyModal',
              }}
              itemBottom={true}
            />
            <Box bg="white" roundedTop="md" roundedBottom="2xl" mt={1}>
              <VStack space={2} my={3}>
                <HStack mx="5">
                  <Text fontWeight="semibold" fontSize="md">
                    Payed: {prog.toFixed(1)}%
                  </Text>
                  <Spacer />
                  <Text _light={{ color: 'muted.500' }} fontWeight="medium" pt={1}>
                    {loan.paid} / {loan.principal}
                  </Text>
                </HStack>
                <Progress colorScheme="primary" value={prog} mx="4" bg="primary.100" />
                <HStack mx="5">
                  <Text fontWeight="medium" color="muted.500">
                    Due: {loan.dueDate}
                  </Text>
                  <Spacer />
                  <Text _light={{ color: 'muted.500' }} fontWeight="medium">
                    {daysTo} days to go
                  </Text>
                </HStack>
              </VStack>
            </Box>
            {transactions.length > 0 ? <SectionHeader title="Transactions" /> : null}
          </Box>
        }
        ListEmptyComponent={
          <Box bg="primary.100" opacity={85} rounded="2xl" mt={1} py={3} px={6}>
            <HStack>
              <Icon as={Feather} name="alert-circle" size="md" color="black" />
              <Text mx={2} fontWeight="medium">
                Waiting for loan to be credited...
              </Text>
            </HStack>
            <Text color="primary.800">
              {loan.initiated
                ? 'Please fund the Loan. Loanee is eagerly waiting for the chums!'
                : 'Your Keep calm. Loan will be credited once your lender releases the funds!'}
            </Text>
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
              credited={item.credited}
              trTitle={item.title}
              trDate={item.date}
              spAmount={
                (item.credited ? '-' : '+') + (item.amount * 1).toFixed(2) + ' ' + item.token
              }
              eqAmount={(item.amount * 120.75).toFixed(2) + ' KES'}
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
