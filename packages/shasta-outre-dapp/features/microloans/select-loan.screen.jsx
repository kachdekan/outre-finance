import { Box, Text, HStack, Icon, FlatList } from 'native-base';
import { useState, useCallback, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

import { SectionHeader, LoansFeatureItem, FeaturesCard } from '@dapp/components';
import { getMyLoans } from '@dapp/contracts';

export default function SelectLoanScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);
  const [loans, setLoans] = useState([]);

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

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <FlatList
        width="95%"
        data={loans}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          loans.length == 0 ? (
            <Box mt="3">
              <Text> You dont have any Loans yet </Text>
            </Box>
          ) : null
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
