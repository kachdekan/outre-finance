import { Actionsheet, HStack, Box, Text, Button, FlatList } from '@clixpesa/native-base';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';

const ScheduleActSheet = (props) => {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dispatch = useDispatch();
  return (
    <Actionsheet isOpen={props.isOpen} onClose={props.onClose}>
      <Actionsheet.Content>
        <Box alignSelf="flex-start" ml={3}>
          <Text fontSize="md" fontWeight="medium">
            Schedule
          </Text>
          <Text fontSize="md" color="muted.500">
            {props.schedule.occurrence} on {props.schedule.day}
          </Text>
        </Box>
        <HStack space={3} m={3}>
          <Button
            variant="subtle"
            rounded="3xl"
            w="25%"
            _text={{ color: 'text.600', fontWeight: 'semibold', mb: '0.5' }}
            onPress={() => props.setSchedule({ day: 'every', occurrence: 'Daily' })}
          >
            Daily
          </Button>
          <Button
            variant="subtle"
            rounded="3xl"
            w="25%"
            _text={{ color: 'text.600', fontWeight: 'semibold', mb: '0.5' }}
            onPress={() => props.setSchedule({ day: props.schedule.day, occurrence: 'Weekly' })}
          >
            Weekly
          </Button>
          <Button
            variant="subtle"
            rounded="3xl"
            w="25%"
            _text={{ color: 'text.600', fontWeight: 'semibold', mb: '0.5' }}
            onPress={() => props.setSchedule({ day: props.schedule.day, occurrence: 'Monthly' })}
          >
            Monthly
          </Button>
        </HStack>
        <Box maxH={120} w="2/3" my={2}>
          {props.schedule.occurrence !== 'Daily' ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={weekDays}
              //keyExtractor={(item, index) => index}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    props.setSchedule({ day: item, occurrence: props.schedule.occurrence })
                  }
                >
                  <Text
                    fontSize="xl"
                    color="text.600"
                    py={1}
                    textAlign="center"
                    borderBottomWidth={1}
                    borderBottomColor="primary.200"
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <>
              <Text fontWeight="medium" textAlign="center">
                Its Gonna be Daily.
              </Text>
              <Text textAlign="center" color="primary.600">
                This frequency means that your first contribution will start Today and repeat
                everyday after that.
              </Text>
            </>
          )}
        </Box>
        <Button
          variant="subtle"
          rounded="3xl"
          bg="primary.100"
          w="60%"
          my={3}
          _text={{ color: 'text.900', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => {
            if (props.isSetCtb) {
              dispatch(props.setCtbSchedule(props.schedule));
            } else {
              dispatch(props.setDisbSchedule(props.schedule));
            }
          }}
          onPressOut={props.onClose}
        >
          Set
        </Button>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ScheduleActSheet;
