import { Box, VStack, Spinner, Text } from 'native-base';
import { useState } from 'react';
import { CodeInput } from '@dapp/components';
import { PIN_BLOCKLIST } from '@dapp/config';
import { useDispatch, useSelector } from 'react-redux';
import { setUserToken, userToken } from '../index';
//import { createWallet, importWallet } from '@dapp/store/wallet/wallet.slice';
//import { createAccount } from '@dapp/store/essential/essential.slice';
import { pendingWallet } from '@dapp/features/wallet';
import { useRegisterUserMutation } from '@dapp/services';

export default function SetPasscodeScreen({ navigation }) {
  const dispatch = useDispatch();
  const userDetails = useSelector((s) => s.essential.userDetails)
  const [registerUser, response ] = useRegisterUserMutation()
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleOnSucess = (code) => {
    setUserToken(code);
    if (pendingWallet) {
      console.log('Is Pending Wallet');
      //dispatch(importWallet(code));
    } else {
      console.log('creating wallet');
      const userData = {...userDetails, token: userToken}
      registerUser(userData)
      if(response.isSuccess){
        dispatch(createAccount());
      }else{
        console.log("Something went wrong")
      }
    }
  };
  const onFullCode1 = (code) => {
    if (isPinValid(code)) {
      setIsVerifying(true);
      console.log('Pin is Valid');
    } else {
      console.log('Pin is Invalid');
      setCode1('');
    }
  };
  const onFullCode2 = (code) => {
    if (code1 === code) {
      console.log('Pin session is done');
      handleOnSucess(code);
      setCode1('');
      setCode2('');
      setIsLoading(true);
      setIsVerifying(false);
    } else {
      console.log('Pin does not match');
      setCode2('');
    }
  };

  return (
    <Box flex={1} bg="muted.50" justifyContent="center">
      {isLoading ? (
        <VStack mx="20" space={3} alignItems="center">
          <Spinner size="lg" />
          <Text fontSize="md">Loading Account...</Text>
        </VStack>
      ) : (
        <>
          {isVerifying ? (
            <Box>
              <Box mx="10">
                <Text fontSize="md" mb="3">
                  Re-enter the passcode
                </Text>
                <Text mb="3">Please input the passcode again to confirm.</Text>
                <CodeInput
                  value={code2}
                  autoFocus={true}
                  password={true}
                  onTextChange={(code) => setCode2(code)}
                  onFulfill={(code) => onFullCode2(code)}
                />
              </Box>

              <Text fontSize="xs" mx="10" mt="5">
                You will use this passcode to authorize transactions and sign into your account.
                Please keep it safe.
              </Text>
            </Box>
          ) : (
            <Box>
              <Box mx="10">
                <Text fontSize="md" mb="3">
                  Set a passcode
                </Text>
                <Text mb="3">
                  You will use this passcode to authorize transactions and sign into you account.
                  Please keep it safe.
                </Text>
                <CodeInput
                  value={code1}
                  password={true}
                  autoFocus={true}
                  onTextChange={(code) => setCode1(code)}
                  onFulfill={(code) => onFullCode1(code)}
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

function isPinValid(pin) {
  return /^\d{6}$/.test(pin) && !PIN_BLOCKLIST.includes(pin);
}
