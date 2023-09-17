import { Box, Text, HStack, VStack, Pressable, Avatar } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setThisRosca } from '@dapp/store/spaces/spaces.slice';

const SpacesFeatureItem = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const title = props.itemTitle.split(' ');
  const initials =
    title.length > 1
      ? title[0].slice(0, 1) + title[1].slice(0, 1)
      : title[0].slice(0, 2).toUpperCase();

  const avatarBg = {
    rosca: 'primary.500',
    personal: 'lightBlue.500',
    regular: 'blue.500',
    contribution: 'emerald.500',
    challenge: 'purple.500',
  };

  return (
    <Pressable
      onPress={() => {
        dispatch(setThisRosca(props.itemParams));
        navigation.navigate(props.screen, props.itemParams ? props.itemParams : {});
      }}
    >
      <HStack space={3} my={2} mx={3} alignItems="center">
        <Avatar
          bg={avatarBg[props.type]}
          //_text={{ color: props.initiated ? 'primary.600' : 'primary.100' }}
        >
          {initials}
        </Avatar>
        <Box flexDirection="row" justifyContent="space-between" width="84%" mt="-0.5">
          <VStack>
            <Text fontWeight="semibold" color="blueGray.800">
              {props.itemTitle.length > 16 ? props.itemTitle.slice(0, 16) + '...' : props.itemTitle}
            </Text>
            <Text>
              {props.type == 'rosca' ? 'Round Due: ' + props.dueDate : 'Due: ' + props.dueDate}
            </Text>
          </VStack>
          <VStack mr={2} maxW="3/5">
            <Text fontWeight="semibold" color="blueGray.800" textAlign="right">
              {props.value}
            </Text>
            <Text color="muted.500" textAlign="right" fontSize="xs" fontWeight="medium" mt={1}>
              {props.type}
            </Text>
          </VStack>
        </Box>
      </HStack>
    </Pressable>
  );
};

export default SpacesFeatureItem;
