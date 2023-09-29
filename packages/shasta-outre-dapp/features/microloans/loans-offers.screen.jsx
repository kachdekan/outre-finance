import { Box, VStack, Stack, FlatList, Button } from 'native-base';
import { useState, useCallback } from 'react';
import { RefreshControl } from 'react-native';

import { LoansOfferItem } from '@dapp/components';
import { LoansData } from '../../data';

export default function LoanOffersScreen({ navigation }) {
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
  const offers = LoansData[1].data;
  let totalBalance = 0;
  return (
    <Box flex={1} bg="$muted100" alignItems="center">
      <VStack width="95%" space={2} mt={2}>
        <FlatList
          data={offers}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Box
              bg="white"
              opacity={85}
              mt={1}
              roundedTop={index == 0 ? '2xl' : 'md'}
              roundedBottom={index == offers.length - 1 ? '2xl' : 'md'}
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
          )}
          keyExtractor={(item) => item.id}
          ListFooterComponent={<Box minHeight="100px"></Box>}
        />
      </VStack>
      <Stack position="absolute" bottom={8} alignItems="center" space={3} width="95%">
        <Button
          rounded="3xl"
          w="60%"
          _text={{ color: 'primary.100', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => {
            navigation.navigate('createOffer');
          }}
        >
          Create an Offer
        </Button>
      </Stack>
    </Box>
  );
}
