import { Box, Text, HStack, Icon, FlatList } from 'native-base';
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

import { SectionHeader, LoansFeatureItem, FeaturesCard } from '@dapp/components';
import { rates, LoansData } from '../../data';
import { getMySpaces, fundSpace } from '@dapp/contracts';

export default function SpacesHomeScreen({ navigation, route }) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);
  const [spaces, setSpaces] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    let thisBal = 0;
    const getSpaces = async () => {
      const spaces = await getMySpaces();
      if (spaces.length > 0) {
        setSpaces(spaces);
        spaces.forEach((space) => {
          if (!space.isPending) {
            thisBal += space.roscaBal * 1;
          }
        });
        setTotalBalance(thisBal);
        thisBal = 0;
      }
    };
    if (refreshing) getSpaces();
    const unsubscribe = navigation.addListener('focus', () => {
      getSpaces();
    });

    return unsubscribe;
  }, [navigation, refreshing]);

  const handleTest = async () => {
    console.log('test repay funds', loans[7].address);
    const res = await fundSpace(loans[7].address, '2');
    console.log(res);
  };

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <FlatList
        width="95%"
        data={spaces}
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
                name: 'New Space',
                screen: 'createSpace',
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-right" size="md" color="primary.600" mr="1" />,
                name: 'Fund Space',
                screen: 'selectSpace',
              }}
              btn3={{
                icon: <Icon as={Feather} name="more-horizontal" size="lg" color="primary.600" />,
                name: 'More',
                screen: 'DummyModal',
              }}
              itemBottom={false}
            />
            {spaces.length > 0 ? (
              <SectionHeader title="Spaces" actionText="See all" action={() => handleTest()} />
            ) : null}
          </Box>
        }
        renderItem={({ item, index }) => (
          <Box
            bg="white"
            opacity={85}
            roundedTop={index === 0 ? '2xl' : 'md'}
            roundedBottom={index === spaces.length - 1 ? '2xl' : 'md'}
            mt={1}
          >
            <LoansFeatureItem
              isLender={false}
              itemTitle={item.name}
              payProgress={
                (item.roscaBal * 1).toFixed(2).toString() +
                ' / ' +
                (item.goalAmount * 1).toFixed(2).toString() +
                ' Paid'
              }
              value={(item.goalAmount * 1).toFixed(2).toString() + ' ' + item.token}
              dueDate={'Due: ' + item.dueDate}
              screen="RoscaHome"
              itemParams={item}
            />
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
}
