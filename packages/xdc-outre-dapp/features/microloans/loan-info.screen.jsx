import { Box, Text, Icon, VStack, HStack, Spacer, Progress, FlatList, Button } from 'native-base';
import { useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { FeaturesCard } from '@dapp/components';
import { Feather } from '@expo/vector-icons';
import { SectionHeader, TransactionItem } from '@dapp/components';
import { getLoanDetails } from '@dapp/contracts';
import { getDaysBetween } from '@dapp/utils';
import { getLoanTxs } from './loans.manager';
import { useGetTxsByAddrQuery } from '@dapp/services';
import { useSelector } from 'react-redux';
import { rates } from '@dapp/utils';

export default function LoanInfoScreen({ navigation, route }) {
  const thisAddress = useSelector((s) => s.wallet.walletInfo.address);
  const [refreshing, setRefreshing] = useState(false);
  const [prog, setProg] = useState(0);
  const [daysTo, setDaysTo] = useState(0);
  const [loan, setLoan] = useState(route.params);
  const [transactions, setTransactions] = useState([]);
  const isLender = route.params.isLender;

  const { data: contractTxs, refetch: refetchTxs } = useGetTxsByAddrQuery(
    route.params.address.replace('0x', 'xdc'),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useEffect(() => {
    const getLoan = async () => {
      const loan = await getLoanDetails(route.params.address);
      setLoan(loan);
      setProg((loan.paid / loan.principal) * 100);
      const daysTo = getDaysBetween(Date.now(), Date.parse(loan.dueDate));
      setDaysTo(daysTo);
    };
    getLoan();
    refetchTxs();
    const unsubscribe = navigation.addListener('focus', () => {
      getLoan();
      refetchTxs();
    });

    return unsubscribe;
  }, [navigation, refreshing]);

  useEffect(() => {
    const getTxs = async () => {
      const thisTxs = await getLoanTxs(contractTxs, thisAddress, route.params.address);
      setTransactions(thisTxs);
    };
    getTxs();
  }, [contractTxs]);

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
              apprxBalance={(loan.currentBal * rates.USXD).toFixed(2).toString()}
              expScreen="DummyModal"
              btn1={{
                icon: (
                  <Icon as={Feather} name="arrow-up-right" size="md" color="primary.600" mr="1" />
                ),
                name: isLender ? 'Fund' : 'Repay',
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
              {isLender
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
              credited={!item.credited}
              trTitle={item.title}
              trDate={item.date}
              spAmount={
                (item.credited ? '+' : '-') + (item.amount * 1).toFixed(2) + ' ' + item.token
              }
              eqAmount={(item.amount * rates.USXD).toFixed(2) + ' KES'}
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
