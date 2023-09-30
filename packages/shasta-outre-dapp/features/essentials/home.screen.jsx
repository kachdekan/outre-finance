import { useState, useCallback, useEffect } from 'react';
import { Box, Text, Button, Icon, FlatList, Spinner } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';
import { FeatureHomeCard, TransactionItem, SectionHeader, FeaturedAssets } from '@dapp/components';
import { tronWeb } from '@dapp/config';
import { rates } from '../../data';
import { useSelector } from 'react-redux';
import {
  useGetAccountInfoQuery,
  useGetAccountTransactionsQuery,
  useGetAccountTrc20TransactionsQuery,
} from '@dapp/services';
import { getWalletBalances, getWalletTxs } from '../wallet/manager.wallet';
import { utils } from 'ethers';

export default function HomeScreen() {
  const thisAddress = useSelector((s) => s.wallet.walletInfo.address);

  const { data: walletInfo, refetch: refetchInfo } = useGetAccountInfoQuery(thisAddress);
  const { data: accountTxs, refetch: refetchTxs } = useGetAccountTransactionsQuery(thisAddress);
  const { data: trc20Txs, refetch: refetchTrc20Txs } =
    useGetAccountTrc20TransactionsQuery(thisAddress);
  const [balance, setBalance] = useState({
    trxBal: 0,
    usddBal: 0,
    balUSD: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetchInfo();
    refetchTxs();
    refetchTrc20Txs();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useEffect(() => {
    console.log(thisAddress);
    const thisBalances = getWalletBalances(walletInfo);
    if (thisBalances !== null) {
      const { trxAvaibleBal, trxFrozenBand, trxFrozenEnergy, usddBal } = thisBalances;
      const trxBal = trxAvaibleBal + trxFrozenBand + trxFrozenEnergy;
      setBalance({ trxBal, usddBal, balUSD: trxBal * rates.TRXusd + usddBal });
    }
  }, [walletInfo]);

  useEffect(() => {
    const thisTxs = getWalletTxs(accountTxs, trc20Txs, thisAddress);
    setTransactions(thisTxs);
  }, [accountTxs, trc20Txs]);

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <FlatList
        width="95%"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#fff']} />
        }
        data={transactions}
        ListHeaderComponent={
          <Box mt="4">
            <FeatureHomeCard
              color="warmGray.800"
              bg="white"
              balance={balance.balUSD.toFixed(2)}
              apprxBalance={(balance.balUSD * rates.USDD).toFixed(2)}
              btn1={{
                icon: <Icon as={Feather} name="plus" size="md" color="primary.600" mr="1" />,
                name: 'Deposit',
                screen: 'depositFunds',
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-right" size="md" color="primary.600" mr="1" />,
                name: 'Transfer',
                screen: 'sendFunds',
              }}
              btn3={{
                icon: <Icon as={Feather} name="refresh-ccw" size="md" color="primary.600" mr="1" />,
                name: 'Swap',
                screen: 'DummyModal',
              }}
              btn4={{
                icon: <Icon as={Feather} name="more-horizontal" size="lg" color="primary.600" />,
                name: 'more',
                screen: 'DummyModal',
              }}
              itemBottom={false}
            />
            <SectionHeader title="Assets" actionText="See all" action={() => handleOnPress()} />
            <FeaturedAssets trxBal={balance.trxBal} usddBal={balance.usddBal} />
            {transactions.length > 0 ? (
              <SectionHeader
                title="Transactions"
                actionText="See all"
                action={() => console.log('See all')}
              />
            ) : null}
            {refreshing ? <Spinner size="lg" mt="6" /> : null}
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
