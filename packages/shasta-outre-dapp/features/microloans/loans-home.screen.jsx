import { Box, Text, HStack, Icon, FlatList } from 'native-base';
import { useState, useCallback, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

import { SectionHeader, LoansFeatureItem, FeaturesCard } from '@dapp/components';
import { getMyLoans, repayLoan } from '@dapp/contracts';

export default function LoansHomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);
  const [loans, setLoans] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    let thisBal = 0;
    const getLoans = async () => {
      const loans = await getMyLoans();
      if (loans.length > 0) {
        setLoans(loans);
        loans.forEach((loan) => {
          if (!loan.isPending) {
            thisBal += loan.currentBal * 1;
          }
        });
        setTotalBalance(thisBal);
        thisBal = 0;
      }
    };
    if (refreshing) getLoans();
    const unsubscribe = navigation.addListener('focus', () => {
      getLoans();
    });

    return unsubscribe;
  }, [navigation, refreshing]);

  const handleTest = async () => {
    console.log('test repay funds', loans[7].address);
    const res = await repayLoan(loans[7].address, '2');
    console.log(res);
  };

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <FlatList
        width="95%"
        data={loans}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <Box mt="3">
            <FeaturesCard
              color="warmGray.800"
              bg="white"
              balance={totalBalance.toFixed(2).toString()}
              apprxBalance={(totalBalance * 120.75).toFixed(2).toString()}
              btn1={{
                icon: <Icon as={Feather} name="plus" size="md" color="primary.600" mr="1" />,
                name: 'Borrow',
                screen: 'Offers',
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-right" size="md" color="primary.600" mr="1" />,
                name: 'Repay',
                screen: 'selectLoan',
              }}
              btn3={{
                icon: <Icon as={Feather} name="more-horizontal" size="lg" color="primary.600" />,
                name: 'More',
                screen: 'DummyModal',
              }}
              itemBottom={false}
            />
            {loans.length > 0 ? (
              <SectionHeader title="Loans" actionText="See all" action={() => handleTest()} />
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
