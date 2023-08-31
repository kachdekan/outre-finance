import { useState, useCallback, useEffect } from 'react';
import { Box, Icon, FlatList, Spinner } from '@clixpesa/native-base';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NativeTokensByAddress } from '@dapp/features/wallet/tokens';
import { fetchBalances } from '@dapp/store/wallet/wallet.slice';
import { useGetTokenTransfersQuery } from '@dapp/services/blockscout';
import { shortenAddress, areAddressesEqual } from '@dapp/utils/addresses';
import { utils } from 'ethers';

import { SectionHeader, TransactionItem, FeatureHomeCard } from '@dapp/components';
import { rates } from '@dapp/data';

export default function HomeScreen(navigation) {
  const dispatch = useDispatch();
  const walletAddress = useSelector((s) => s.wallet.walletInfo.address);
  const balances = useSelector((s) => s.wallet.walletBalances.tokenAddrToValue);
  const tokenAddrs = Object.keys(NativeTokensByAddress);
  const { isSignerSet } = useSelector((s) => s.essential);
  const [refreshing, setRefreshing] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [news, setNews] = useState([]);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  // fetch balances
  let totalBalance = 0;
  useEffect(() => {
    if (!balances) {
      if (isSignerSet) {
        //handleGetBalances()
        dispatch(fetchBalances());
      }
    }
  }, [isSignerSet]);

  if (balances) {
    totalBalance = balances[tokenAddrs[1]] * 1 + balances[tokenAddrs[0]] * rates.MatciUsd;
  }

  // get data from blockscout
  const {
    data: txData,
    error: txError,
    isLoading: txIsLoading,
  } = useGetTokenTransfersQuery(walletAddress);
  const handleGetTransactions = () => {
    const thisTxs = [];
    const goodTxs = Array.prototype.filter.call(
      txData.result,
      (txs) =>
        txs.value.toString() * 1 >= utils.parseUnits('0.0008', txs.tokenDecimal).toString() * 1,
    );
    goodTxs.forEach((tx) => {
      const txDate = new Date(tx.timeStamp * 1000);
      const date = txDate.toDateString().split(' ');
      const txItem = {
        tx: tx.blockNumber,
        credited: areAddressesEqual(tx.to, walletAddress) ? true : false,
        title: areAddressesEqual(tx.to, walletAddress)
          ? shortenAddress(tx.from, true)
          : shortenAddress(tx.to, true),
        date: date[0] + ', ' + date[2] + ' ' + date[1] + ', ' + txDate.toTimeString().slice(0, 5),
        amount: utils.formatUnits(tx.value, tx.tokenDecimal),
        token: tx.tokenSymbol,
      };
      thisTxs.push(txItem);
    });
    setTransactions(thisTxs);
  };

  useEffect(() => {
    if (txData) handleGetTransactions();
  }, [txData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(fetchBalances());
    wait(2000).then(async () => {
      if (txData) handleGetTransactions();
      setRefreshing(false);
    });
  }, []);

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <FlatList
        width="95%"
        data={transactions.slice(0, 10)}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <Box mt="4">
            <FeatureHomeCard
              color="warmGray.800"
              bg="white"
              balance={totalBalance.toFixed(4).toString()}
              apprxBalance={(totalBalance * rates.USDC).toFixed(2).toString()}
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
                icon: <Icon as={Feather} name="more-horizontal" size="lg" color="primary.600" />,
                name: 'More',
                screen: 'DummyModal',
              }}
              itemBottom={false}
            />
            {transactions.length > 0 ? (
              <SectionHeader
                title="Transactions"
                actionText="See all"
                action={() => console.log('See all')}
              />
            ) : null}
            {txIsLoading ? <Spinner size="lg" mt="6" /> : null}
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
