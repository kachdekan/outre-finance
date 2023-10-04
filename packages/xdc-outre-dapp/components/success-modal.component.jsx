import { Modal, Icon, Text, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SuccessModal = ({ isOpen, onClose, message, screen, scrnOptions }) => {
  const navigation = useNavigation();
  return (
    <Modal isOpen={isOpen} onClose={onClose} animationPreset="slide" mt="60%" mb="10">
      <Modal.Content width="80%" maxWidth="400px">
        <Modal.Body alignItems="center">
          <Icon
            as={Ionicons}
            name={scrnOptions.isSuccess ? 'md-checkmark-circle' : 'close-circle'}
            size="6xl"
            color={scrnOptions.isSuccess ? 'success.600' : 'danger.600'}
          />
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
              scrnOptions.isSuccess ? navigation.navigate(screen, scrnOptions) : null;
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
