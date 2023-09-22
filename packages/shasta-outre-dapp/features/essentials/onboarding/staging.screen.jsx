import { Box, Text } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { userToken } from '../user.token';
import { useRegisterUserMutation } from '@dapp/services';
import { useEffect } from 'react';
import { setLoggedIn, setHasAccount} from '@dapp/store/essential/essential.slice';

export default function StagingScreen() {
  const userDetails = useSelector((s) => s.essential.userDetails)
   const dispatch = useDispatch();
  const [ registerUser, response ] = useRegisterUserMutation()
  const userData = {...userDetails, token: userToken}

  useEffect(() => {
    registerUser(userData)
  }, [])

  
  useEffect(() => {
      if (response.isSuccess) {
        dispatch(setLoggedIn(true))
      }
  }, [response])
  
  return (
    <Box flex={1} bg="muted.100" alignItems="center" justifyContent="center">
      { response.isSuccess ? <Text>Account Created successfully</Text> : 
        <> 
          {response.isError && response.status === "rejected" ? 
            <Text>{response.error.data}</Text> : 
            <Text>Loading Account...</Text>}
        </>
      }
    </Box>
  );
}
