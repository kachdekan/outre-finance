import { Box, VStack, Stack, FlatList, Button } from 'native-base';
import { useState, useCallback, useEffect } from 'react';
import { RefreshControl } from 'react-native';

import { LoansOfferItem } from '@dapp/components';
import { LoansData } from '../../data';
import { getAllOffers } from '@dapp/contracts';

export default function LoanOffersScreen({ navigation }) {
  const [offers, setOffers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 3000);
  }, []);

  useEffect(() => {
    setRefreshing(true);
    const getOffers = async () => {
      const offers = await getAllOffers();
      setOffers(offers);
    };
    if (refreshing) getOffers();
    const unsubscribe = navigation.addListener('focus', () => {
      getOffers();
    });
    setRefreshing(false);
    return unsubscribe;
  }, [navigation, refreshing]);

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
                itemTitle={item.lenderName}
                type="individual"
                principal={item.poolsize}
                interest={item.interest}
                duration={{
                  min: item.minDuration,
                  max: item.maxDuration,
                }}
                limit={{
                  min: item.minAmount,
                  max: item.maxAmount,
                }}
                screen="borrowLoan"
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
