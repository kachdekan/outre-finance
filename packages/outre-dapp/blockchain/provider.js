import { providers } from 'ethers';
import { config } from './config';
import { STALE_BLOCK_TIME } from '@dapp/consts';
import { promiseTimeout, sleep } from '@dapp/utils/promises';
import { isStale } from '@dapp/utils/time';

let provider = undefined;

export function isProviderSet() {
  return !!provider;
}
export async function connectToProvider() {
  const { jsonRpcUrlPrimary, jsonRpcUrlSecondary } = config;

  let connectionResult = await connectToJsonRpcProvider(jsonRpcUrlPrimary);

  if (!connectionResult && jsonRpcUrlSecondary) {
    connectionResult = await connectToJsonRpcProvider(jsonRpcUrlSecondary);
  }

  if (!connectionResult) {
    throw new Error('All json rpc providers failed to connect');
  }
}

async function connectToJsonRpcProvider(url) {
  try {
    console.log(`Connecting to json rpc provider: ${url}`);
    provider = new providers.JsonRpcProvider(url);
    for (let i = 0; i < 3; i++) {
      const blockAndNetworkP = Promise.all([provider.getBlock('latest'), provider.getNetwork()]);
      const blockAndNetwork = await promiseTimeout(blockAndNetworkP, 1000);
      if (blockAndNetwork && isProviderSynced(blockAndNetwork[0], blockAndNetwork[1])) {
        console.log('Provider is connected');
        return true;
      }
      // Otherwise wait a bit and then try again
      await sleep(1000);
    }
    throw new Error('Unable to sync after 3 attempts');
  } catch (error) {
    console.log(`Failed to connect to json rpc provider: ${url}`, error);
    clearProvider();
    return false;
  }
}

function isProviderSynced(block, network) {
  return (
    block &&
    block.number &&
    block.timestamp &&
    !isStale(block.timestamp * 1000, STALE_BLOCK_TIME * 6) &&
    network &&
    network.chainId === config.chainId
  );
}
export function getProvider() {
  if (!provider) {
    console.log('Provider is not yet initialized');
    throw new Error('Attempting to use provider before initialized');
  }
  return provider;
}
export function clearProvider() {
  provider = undefined;
}
