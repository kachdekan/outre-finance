import { useState, useCallback, useEffect } from 'react';
import { Box, Text, Button, Icon, FlatList, Spinner } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';
import { FeatureHomeCard, TransactionItem, SectionHeader, FeaturedAssets } from '@dapp/components';
import { rates } from '@dapp/utils';
import { useSelector } from 'react-redux';
import { getWalletBalances, getWalletTxs } from '../wallet/manager.wallet';
import { utils } from 'ethers';
import { useGetTxsByAddrQuery, useGetTokenTransfersQuery } from '@dapp/services';

export default function HomeScreen() {
  const thisAddress = useSelector((s) => s.wallet.walletInfo.address);
  const isSignerSet = useSelector((s) => s.essential.isSignerSet);
  const [balance, setBalance] = useState({
    xdcBal: 0,
    usxdBal: 0,
    balUSD: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data: accountTxs, refetch: refetchTxs } = useGetTxsByAddrQuery(
    thisAddress.replace('0x', 'xdc'),
  );
  const { data: xrc20Txs, refetch: refetchXrc20Txs } = useGetTokenTransfersQuery(
    thisAddress.replace('0x', 'xdc'),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetchTxs();
    refetchXrc20Txs();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useEffect(() => {
    const getBalances = async () => {
      const thisBalances = await getWalletBalances(isSignerSet, thisAddress);
      if (thisBalances !== null) {
        const { xdcBal, usxdBal } = thisBalances;
        if (!!xdcBal) {
          setBalance({ xdcBal, usxdBal, balUSD: xdcBal * rates.XDCusd + usxdBal });
        }
      }
    };
    getBalances();
  }, [thisAddress, refreshing]);

  useEffect(() => {
    const thisTxs = getWalletTxs(accountTxs, xrc20Txs, thisAddress);
    setTransactions(thisTxs);
  }, [accountTxs, xrc20Txs]);

  const handleOnPress = async () => {
    const thisTxs = getWalletTxs(accountTxs, xrc20Txs, thisAddress);
    console.log(thisTxs);
  };

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <FlatList
        width="95%"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={transactions}
        ListHeaderComponent={
          <Box mt="4">
            <FeatureHomeCard
              color="warmGray.800"
              bg="white"
              balance={balance.balUSD.toFixed(2)}
              apprxBalance={(balance.balUSD * rates.USXD).toFixed(2)}
              btn1={{
                icon: <Icon as={Feather} name="plus" size="md" color="primary.600" mr="1" />,
                name: 'Deposit',
                screen: 'depositFunds',
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-right" size="md" color="primary.600" mr="1" />,
                name: 'Transfer',
                screen: 'transferFunds',
                params: balance,
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
            <FeaturedAssets nativeBal={balance.xdcBal} stableBal={balance.usxdBal} />
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
