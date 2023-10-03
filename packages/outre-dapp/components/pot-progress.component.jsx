import { Box, VStack, HStack, Progress, Text, Spacer } from 'native-base';

const PotProgressCard = ({
  roundBal,
  goalAmount,
  dueDate,
  memberCount,
  ctbCount,
  myCtb,
  token,
}) => {
  const prog = ((roundBal * 1) / (goalAmount * 1)) * 100;
  return (
    <Box>
      <Box bg="white" roundedTop="xl" roundedBottom="md">
        <VStack space={2}>
          <HStack mx="5" my="2">
            <Text fontWeight="semibold" fontSize="md">
              Saved: {prog.toFixed(1)}%
            </Text>
            <Spacer />
            <Text _light={{ color: 'muted.500' }} fontWeight="medium" pt={1}>
              {roundBal} / {goalAmount}
            </Text>
          </HStack>
          <Progress colorScheme="primary" value={prog} mx="4" bg="primary.100" />
          <HStack mx="5" my="2">
            <Text fontWeight="medium" color="muted.500">
              Due: {dueDate}
            </Text>
            <Spacer />
            <Text _light={{ color: 'muted.500' }} fontWeight="medium">
              {ctbCount}/{memberCount} Contributors
            </Text>
          </HStack>
        </VStack>
      </Box>
      <Box bg="white" roundedTop="md" roundedBottom="xl" mt={1}>
        <HStack mx="5" my="2" pb={1} justifyItems="center">
          <Text fontWeight="medium" fontSize="md" color="blueGray.600">
            Your Contribution:
          </Text>
          <Spacer />
          <Text _light={{ color: 'primary.600' }} fontWeight="medium" py={1}>
            {myCtb}/{(goalAmount * 1) / (memberCount * 1)} {token}
          </Text>
        </HStack>
      </Box>
    </Box>
  );
};

export default PotProgressCard;
