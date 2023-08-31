import { config } from '@dapp/blockchain/config';

const MATIC = {
  symbol: 'MATIC',
  name: 'Matic Token',
  address: config.contractAddresses.MaticToken,
  decimals: 18,
  chainId: config.chainId,
  sortOrder: 10,
};
const USDC = {
  symbol: 'USDC',
  name: 'USD Coin',
  address: config.contractAddresses.StableToken,
  decimals: 18,
  chainId: config.chainId,
  //exchangeAddress: config.contractAddresses.Exchange,
  sortOrder: 20,
};

const NativeTokens = [MATIC, USDC];
const StableTokens = [USDC];

const NativeTokensByAddress = {
  [MATIC.address]: MATIC,
  [USDC.address]: USDC,
};

module.exports = {
  MATIC,
  USDC,
  NativeTokens,
  NativeTokensByAddress,
  StableTokens,
};
