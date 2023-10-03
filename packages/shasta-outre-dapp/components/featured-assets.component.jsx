import { Box, HStack, Stack, Text, VStack, Avatar } from 'native-base';
import { rates } from '../data';

const FeaturedAssets = ({ trxBal, usddBal }) => {
  return (
    <HStack space="2%" width="95%">
      <HStack justifyContent="space-between" bg="white" py={2} px={3} minW="48%" rounded="2xl">
        <HStack alignItems="center" space={2}>
          <Avatar
            size="sm"
            bg="primary.200"
            _text={{ color: 'primary.800' }}
            source={{
              uri: 'https://assets.coingecko.com/coins/images/22471/small/xOesRfpN_400x400.jpg',
            }}
          >
            TRX
          </Avatar>
          <Text>TRX</Text>
        </HStack>
        <Stack mr={1}>
          <Text textAlign="right" color="warmGray.800" fontWeight="semibold">
            {trxBal.toFixed(2)}
          </Text>
          <Text textAlign="right">≈ $ {(trxBal * rates.TRXusd).toFixed(2)}</Text>
        </Stack>
      </HStack>
      <HStack justifyContent="space-between" bg="white" py={2} px={3} minW="49%" rounded="2xl">
        <HStack alignItems="center" space={2}>
          <Avatar
            size="sm"
            bg="primary.200"
            _text={{ color: 'primary.800' }}
            source={{
              uri: 'https://assets.coingecko.com/coins/images/25380/small/UUSD.jpg',
            }}
          >
            USDD
          </Avatar>
          <Text>USDD</Text>
        </HStack>
        <Stack mr={1}>
          <Text textAlign="right" color="warmGray.800" fontWeight="semibold">
            {usddBal.toFixed(2)}
          </Text>
          <Text textAlign="right">≈ $ {usddBal.toFixed(2)}</Text>
        </Stack>
      </HStack>
    </HStack>
  );
};

export default FeaturedAssets;
