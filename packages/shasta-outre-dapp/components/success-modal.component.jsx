import { Modal, Icon, Text, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SuccessModal = ({ isOpen, onClose, message, screen, scrnOptions }) => {
  const navigation = useNavigation();
  return (
    <Modal isOpen={isOpen} onClose={onClose} animationPreset="slide" mt="60%" mb="10">
      <Modal.Content width="80%" maxWidth="400px">
        <Modal.Body alignItems="center">
          <Icon as={Ionicons} name="md-checkmark-circle-outline" size="6xl" color="success.500" />
          <Text textAlign="center" mt={3}>
            {message}
          </Text>
          <Button
            variant="subtle"
            rounded="3xl"
            bg="primary.100"
            w="75%"
            mt={3}
            _text={{ color: 'text.900', fontWeight: 'semibold', mb: '0.5' }}
            onPress={() => {
              onClose();
              navigation.navigate(screen, scrnOptions);
            }}
          >
            OK
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default SuccessModal;
