import {
  Box,
  Text,
  HStack,
  Stack,
  Button,
  Heading,
  Icon,
  Spinner,
  Divider,
  Progress,
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FeatureHomeCard = ({
  color,
  bg,
  btn1,
  btn2,
  btn3,
  btn4,
  itemBottom,
  apprxBalance,
  balance,
}) => {
  const navigation = useNavigation();
  const bal = balance.split('.');
  return (
    <Box bg={bg} roundedTop="2xl" roundedBottom={itemBottom ? 'md' : '2xl'}>
      <HStack justifyContent="space-between">
        <Stack mx="4" my="3">
          <Text _light={{ color }}>Total Balance (USD)</Text>
          <HStack alignItems="center">
            <Heading size="xl" letterSpacing="0.5" _light={{ color }}>
              $ {bal[0] + '.'}
            </Heading>
            <Heading size="lg" letterSpacing="0.5" mt={1} _light={{ color }}>
              {bal[1]}
            </Heading>
            <Icon as={Feather} name="chevron-down" size="lg" color={color} ml={2} />
          </HStack>

          <Text _light={{ color }} lineHeight="sm">
            ≈ {apprxBalance} KES
          </Text>
          <Divider my="2" minW="full" />
          <HStack justifyContent="space-between">
            <Box minW="40%">
              <HStack justifyContent="space-between">
                <Text color="gray.600" fontSize="sm" lineHeight="sm">
                  Energy
                </Text>
                <Text color="gray.600" fontSize="sm" lineHeight="sm">
                  78K/88K
                </Text>
              </HStack>
              <Progress size="xs" value={88} mt={2} colorScheme="warning" bg="warning.100" />
            </Box>
            <Box minW="40%">
              <HStack justifyContent="space-between">
                <Text color="gray.600" fontSize="sm" lineHeight="sm">
                  Bandwidth
                </Text>
                <Text color="gray.600" fontSize="sm" lineHeight="sm">
                  1.1K/2K
                </Text>
              </HStack>
              <Progress size="xs" value={55} mt={2} colorScheme="emerald" bg="emerald.100" />
            </Box>
          </HStack>
        </Stack>
      </HStack>
      {balance ? null : <Spinner right="1/2" top={10} position="absolute" size="lg" />}
      <HStack mx="4" mb="3" justifyContent="center" space="2">
        <Button
          leftIcon={btn1.icon}
          rounded="3xl"
          variant="subtle"
          pr="4"
          size="sm"
          _text={{ color: 'primary.600', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => navigation.navigate(btn1.screen, btn1.screenParams)}
        >
          {btn1.name}
        </Button>
        <Button
          leftIcon={btn2.icon}
          rounded="3xl"
          variant="subtle"
          pr="4"
          size="sm"
          c
          _text={{ color: 'primary.600', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => navigation.navigate(btn2.screen, btn2.params ? { ...btn2.params } : null)}
        >
          {btn2.name}
        </Button>
        <Button
          leftIcon={btn3.icon}
          rounded="3xl"
          variant="subtle"
          pr="4"
          size="sm"
          _text={{ color: 'primary.600', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => navigation.navigate(btn3.screen)}
        >
          {btn3.name}
        </Button>
        <Button
          leftIcon={btn4.icon}
          rounded="3xl"
          variant="subtle"
          px="4"
          size="sm"
          _text={{ color: 'primary.600', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => navigation.navigate(btn4.screen)}
        />
      </HStack>
    </Box>
  );
};

export default FeatureHomeCard;
