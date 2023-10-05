import { Box, Text } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { userToken } from '@dapp/config/usertoken';
import { useRegisterUserMutation, useAddWalletMutation } from '@dapp/services';
import { useEffect } from 'react';
import { setLoggedIn, setHasAccount } from '@dapp/store/essential/essential.slice';
import { walletsListCache } from '@dapp/features/wallet';
import { updateWalletAddress } from '@dapp/store/wallet/wallet.slice';

export default function StagingScreen() {
  const userDetails = useSelector((s) => s.essential.userDetails);
  const dispatch = useDispatch();
  const [registerUser, resRegisterUser] = useRegisterUserMutation();
  const [addWallet, resAddWallet] = useAddWalletMutation();
  const userData = { ...userDetails, token: userToken };

  useEffect(() => {
    registerUser(userData);
  }, []);

  useEffect(() => {
    if (resRegisterUser.isSuccess) {
      console.log('Backing up wallet');
      const wallet = Object.values(walletsListCache).find((w) => w.walletName === 'Wallet 1');
      console.log(wallet);
      addWallet({
        address: wallet.address,
        enMnemonic: wallet.enMnemonic,
        enPrivateKey: wallet.enPrivateKey,
      });
    }
  }, [resRegisterUser.isSuccess]);

  console.log('resAddWallet', resAddWallet.isSuccess);
  useEffect(() => {
    if (resAddWallet.isSuccess) {
      const wallet = Object.values(walletsListCache).find((w) => w.walletName === 'Wallet 1');
      dispatch(updateWalletAddress(wallet.address));
      dispatch(setLoggedIn(true));
    }
  }, [resAddWallet.isSuccess]);

  return (
    <Box flex={1} bg="muted.100" alignItems="center" justifyContent="center">
      {resAddWallet.isSuccess ? (
        <Text>Account Created successfully</Text>
      ) : (
        <>
          {resAddWallet.isError && resAddWallet.status === 'rejected' ? (
            <Text>{resAddWallet.error.data}</Text>
          ) : (
            <Text>Loading Account...</Text>
          )}
        </>
      )}
    </Box>
  );
}
