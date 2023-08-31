import {
  Box,
  Text,
  Image,
  FormControl,
  Stack,
  Input,
  Button,
  HStack,
  Select,
  CheckIcon,
} from '@clixpesa/native-base';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { setSpaceInfo } from '@dapp/store/spaces/spaces.slice';

export default function CreateSpaceScreen({ navigation }) {
  const walletAddress = useSelector((s) => s.wallet.walletInfo.address);
  const suggestions = ['Savings', 'Vacation', 'Chama', 'Gift', 'Sherehe', 'Emergency', 'Masomo'];
  const dispatch = useDispatch();
  const [spaceName, setSpaceName] = useState('');
  const [spaceType, setSpaceType] = useState('');

  const nextScreen = spaceType !== 'personal' ? 'selectContacts' : 'setPersonalGoal';
  const defaultImg =
    spaceType === 'personal' || spaceType === ''
      ? 'https://source.unsplash.com/0ITvgXAU5Oo'
      : 'https://source.unsplash.com/ybPJ47PMT_M';

  return (
    <Box flex={1} bg="muted.100">
      <Image
        source={{
          uri: defaultImg,
        }}
        alt="Your space photo"
        height="35%"
        minH={240}
      />
      <FormControl alignItems="center" mt={2}>
        <Stack space={2} w="80%">
          <Stack>
            <FormControl.Label>Select your space type</FormControl.Label>
            <Select
              size="md"
              bg="white"
              accessibilityLabel="Choose Space Type"
              placeholder="Space type"
              _selectedItem={{
                bg: 'primary.600',
                endIcon: <CheckIcon size={2} color="muted.200" />,
              }}
              mt="1"
              onValueChange={(type) => setSpaceType(type)}
            >
              <Select.Item label="Personal Space" value="personal" />
              <Select.Item label="Challenge Space" value="challenge" />
              <Select.Item label="Chamaa (ROSCA) Group" value="rosca" />
            </Select>
          </Stack>
          <Stack>
            <FormControl.Label>Name your space</FormControl.Label>
            <Input
              bg="white"
              p={2}
              placeholder="Savings"
              size="lg"
              value={spaceName}
              onChangeText={(text) => setSpaceName(text)}
            />
          </Stack>
          <HStack space={3} flexWrap="wrap">
            {suggestions.map((item) => {
              return (
                <Button
                  size="sm"
                  variant="subtle"
                  bg="primary.100"
                  shadow="1"
                  mb={2}
                  key={item}
                  onPress={() => setSpaceName(item)}
                >
                  {item}
                </Button>
              );
            })}
          </HStack>
        </Stack>
        <Stack alignItems="center" width="95%" mt="15%">
          <Button
            rounded="3xl"
            disabled={spaceType ? false : true}
            pr="4"
            minW="75%"
            _text={{ color: 'primary.100', fontWeight: 'semibold', mb: '0.5' }}
            onPress={() => {
              dispatch(setSpaceInfo({ spaceName, spaceType, walletAddress, defaultImg }));
              navigation.navigate(nextScreen);
            }}
          >
            Continue
          </Button>
        </Stack>
      </FormControl>
    </Box>
  );
}
