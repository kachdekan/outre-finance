import { Box, Text, VStack, Stack, Icon, FlatList, Spacer, Button } from '@clixpesa/native-base';
import { useState, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

import { SectionHeader, LoansOfferItem, FeatureHomeCard } from '@dapp/components';
import { rates, LoansData } from '@dapp/data';

export default function LoanRequestsScreen() {
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
  const requests = LoansData[2].data;
  let totalBalance = 0;
  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <VStack width="95%" space={3}>
        <Stack>
          <FlatList
            mt={2}
            data={requests}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <Box
                bg="white"
                opacity={85}
                mt={1}
                roundedTop={index == 0 ? '2xl' : 'md'}
                roundedBottom={index == requests.length - 1 ? '2xl' : 'md'}
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
            )}
            keyExtractor={(item) => item.id}
            ListFooterComponent={<Box minHeight="100px"></Box>}
          />
        </Stack>
        <Spacer />
      </VStack>
      <Stack position="absolute" bottom={8} alignItems="center" space={3} width="95%">
        <Button
          rounded="3xl"
          w="60%"
          _text={{ color: 'primary.100', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => {
            navigation.navigate('createRequest');
          }}
        >
          Create a Request
        </Button>
      </Stack>
    </Box>
  );
}
