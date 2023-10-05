import { Box, HStack, Stack, Text, VStack, Avatar } from 'native-base';
import { rates } from '@dapp/utils';

const FeaturedAssets = ({ nativeBal, stableBal }) => {
  return (
    <HStack space="2%" width="95%">
      <HStack justifyContent="space-between" bg="white" py={2} px={3} minW="48%" rounded="2xl">
        <HStack alignItems="center" space={2}>
          <Avatar
            size="sm"
            bg="primary.200"
            _text={{ color: 'primary.800' }}
            source={{
              uri: 'https://assets.coingecko.com/coins/images/2912/small/xdc-icon.png',
            }}
          >
            XDC
          </Avatar>
          <Text>XDC</Text>
        </HStack>
        <Stack mr={1}>
          <Text textAlign="right" color="warmGray.800" fontWeight="semibold">
            {nativeBal.toFixed(2)}
          </Text>
          <Text textAlign="right">≈ $ {(nativeBal * rates.XDCusd).toFixed(2)}</Text>
        </Stack>
      </HStack>
      <HStack justifyContent="space-between" bg="white" py={2} px={3} minW="49%" rounded="2xl">
        <HStack alignItems="center" space={2}>
          <Avatar
            size="sm"
            bg="primary.200"
            _text={{ color: 'primary.800' }}
            source={{
              uri: 'https://assets.coingecko.com/coins/images/13056/small/USDX_coin.png?1696512841',
            }}
          >
            USXD
          </Avatar>
          <Text>USXD</Text>
        </HStack>
        <Stack mr={1}>
          <Text textAlign="right" color="warmGray.800" fontWeight="semibold">
            {stableBal.toFixed(2)}
          </Text>
          <Text textAlign="right">≈ $ {stableBal.toFixed(2)}</Text>
        </Stack>
      </HStack>
    </HStack>
  );
};

export default FeaturedAssets;
