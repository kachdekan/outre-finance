import { Box, Text, Button, Icon } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { tronWeb } from '@dapp/config';
import { FeatureHomeCard } from '@dapp/components';

export default function HomeScreen() {
  const handleOnPress = async () => {
    //const wallet = await tronWeb.Trx.getAccount("TWxuRajG9Ehhag2g7XxrnePZWUhQ7Azscp");

    const wallet = await tronWeb.trx.getBalance('TWxuRajG9Ehhag2g7XxrnePZWUhQ7Azscp');
    console.log(wallet);
    //console.log(tronWeb.Trx);
  };
  return (
    <Box flex={1} bg="muted.100" alignItems="center" justifyContent="center">
      <FeatureHomeCard
        color="warmGray.800"
        bg="white"
        balance="10,000.000"
        apprxBalance="1,000,000"
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
    </Box>
  );
}
