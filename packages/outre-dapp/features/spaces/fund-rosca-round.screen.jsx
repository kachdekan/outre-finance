import {
  Box,
  Stack,
  VStack,
  HStack,
  Text,
  Input,
  Pressable,
  Button,
  Spacer,
  Icon,
  useDisclose,
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { utils } from 'ethers';
import { smartContractCall } from '@dapp/blockchain/blockchainHelper';
import { NativeTokensByAddress } from '@dapp/features/wallet/tokens';
import { SuccessModal } from '@dapp/components';
import { shortenAddress } from '@dapp/utils/addresses';

export default function FundRoscaRoundScreen({ route }) {
  const { roscaAddress, dueAmount } = route.params;
  const { isOpen, onOpen, onClose } = useDisclose();
  const balances = useSelector((s) => s.wallet.walletBalances.tokenAddrToValue);
  const tokenAddrs = Object.keys(NativeTokensByAddress);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fundRound = async () => {
    const fundAmount = utils.parseUnits(amount, 6).toString();
    try {
      setIsLoading(true);
      const txReceipt = await smartContractCall('Rosca', {
        contractAddress: roscaAddress,
        approvalContract: 'StableToken',
        method: 'fundRound',
        methodType: 'write',
        params: [fundAmount],
      });
      //console.log(txReceipt)
      handleTxReceipt(txReceipt);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const handleTxReceipt = async (txReceipt) => {
    if (txReceipt.to === roscaAddress && txReceipt.status == 1) {
      onOpen();
      setIsLoading(false);
    }
  };

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <VStack space={3} width="95%">
        <Text mx={6} mt={8}>
          Set an amount to fund
        </Text>
        <VStack space={1}>
          <Box bg="white" roundedTop="xl" roundedBottom="md">
            <HStack m={3} justifyContent="space-between" alignItems="center">
              <HStack>
                <Text fontSize="lg" fontWeight="semibold" pl={1}>
                  cUSD
                </Text>
                <Icon as={Feather} name="chevron-down" size="md" mx="1" mt={1} />
              </HStack>
              <Input
                py={2}
                textAlign="right"
                minW="2/3"
                placeholder="0.00"
                size="lg"
                keyboardType="numeric"
                InputRightElement={
                  <Text fontSize="md" fontWeight="medium" pr={3}>
                    cUSD
                  </Text>
                }
                value={amount}
                onChangeText={(amount) => setAmount(amount)}
              />
            </HStack>
            <HStack px={5} justifyContent="space-between">
              <Text mt={1}>Balance: {(balances[tokenAddrs[1]] * 1).toFixed(2)} cUSD</Text>
              <Pressable
                bg="primary.100"
                px={2}
                py={1}
                mb={2}
                rounded="lg"
                onPress={() => {
                  setAmount(dueAmount);
                }}
              >
                <Text color="primary.600">Max</Text>
              </Pressable>
            </HStack>
          </Box>
          <HStack
            bg="white"
            p={4}
            pt={3}
            justifyContent="space-between"
            roundedTop="md"
            roundedBottom="xl"
          >
            <Text fontSize="md">Amount Due: </Text>
            <Text fontSize="md">{dueAmount} cUSD</Text>
          </HStack>
        </VStack>
      </VStack>
      <Spacer />
      <Stack alignItems="center" mb={8} width="95%">
        <Button
          isLoading={isLoading}
          isLoadingText="Submitting"
          rounded="3xl"
          w="60%"
          _text={{ color: 'primary.100', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => {
            fundRound();
          }}
        >
          Fund
        </Button>
      </Stack>
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        message={`${(+amount).toFixed(2)} cUSD \nsuccessfully sent to \n${
          roscaAddress ? shortenAddress(roscaAddress, true) : 'xdc0...000'
        }`}
        screen="RoscaHome"
        scrnOptions={{ roscaAddress }}
      />
    </Box>
  );
}
