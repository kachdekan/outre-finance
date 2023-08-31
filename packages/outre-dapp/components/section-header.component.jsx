import { HStack, Text, Spacer, Pressable } from '@clixpesa/native-base';

const SectionHeader = ({ title, action, actionText }) => (
  <HStack mx={4} mt={3} mb={2}>
    <Text fontWeight="medium" color="blueGray.600">
      {title}
    </Text>
    <Spacer />
    {action && (
      <Pressable onPress={action}>
        <Text color="primary.600">{actionText}</Text>
      </Pressable>
    )}
  </HStack>
);

export default SectionHeader;
