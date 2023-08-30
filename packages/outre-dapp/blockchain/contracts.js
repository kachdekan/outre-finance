import { Contract, utils } from 'ethers';
import { Erc20Abi } from './Abis/erc20';
import { Erc721Abi } from './Abis/erc721';
import { CeloTokenAbi } from './Abis/celoToken';
import { StableTokenAbi } from './Abis/stableToken';
import { GasPriceMinABI } from './Abis/gasPriceMin';
import SpacesAbi from './Abis/Jsons/Spaces.json';
import RoscaAbi from './Abis/Jsons/Rosca.json';
import PersonalAbi from './Abis/Jsons/Personal.json';
import P2PLoansAbi from './Abis/Jsons/P2PLoans.json';
import { getSigner } from './signer';
import { config } from './config';
import { areAddressesEqual, normalizeAddress } from '@dapp/utils/addresses';

//!TODO: Find best way to handle signers.
let contractCache = {};
let tokenContractCache = {}; // token address to contract

export const spacesIface = new utils.Interface(SpacesAbi);
export const roscaIface = new utils.Interface(RoscaAbi);
export const personalIface = new utils.Interface(PersonalAbi);
export const loansIface = new utils.Interface(P2PLoansAbi);

export function getContract(c) {
  const cachedContract = contractCache[c];
  if (cachedContract) return cachedContract;
  const signer = getSigner();
  const address = config.contractAddresses[c];
  const abi = getContractAbi(c);
  const contract = new Contract(address, abi, signer);
  contractCache[c] = contract;
  return contract;
}

export function getCustomContract(cc, addr) {
  const cachedContract = contractCache[addr];
  if (cachedContract) return cachedContract;
  const signer = getSigner();
  const address = addr;
  const abi = getContractAbi(cc);
  const contract = new Contract(address, abi, signer);
  contractCache[addr] = contract;
  return contract;
}

export function getErc20Contract(tokenAddress) {
  return getTokenContract(tokenAddress, Erc20Abi);
}

export function getErc721Contract(tokenAddress) {
  return getTokenContract(tokenAddress, Erc721Abi);
}

// Search for token contract by address
export function getTokenContract(tokenAddress, abi) {
  const normalizedAddr = normalizeAddress(tokenAddress);
  const cachedContract = tokenContractCache[normalizedAddr];
  if (cachedContract) return cachedContract;
  const signer = getSigner();
  const contract = new Contract(normalizedAddr, abi, signer);
  tokenContractCache[normalizedAddr] = contract;
  return contract;
}

export function getContractAbi(c) {
  switch (c) {
    case 'GoldToken':
      return CeloTokenAbi;
    case 'StableToken':
    case 'StableTokenEUR':
    case 'StableTokenBRL':
      return StableTokenAbi;
    case 'Spaces':
      return SpacesAbi;
    case 'Rosca':
      return RoscaAbi;
    case 'Personal':
      return PersonalAbi;
    case 'P2PLoans':
      return P2PLoansAbi;
    case 'MinGasPrice':
      return GasPriceMinABI;
    default:
      throw new Error(`No ABI for contract ${c}`);
  }
}

// Search for core contract by address
export function getContractByAddress(address) {
  const name = getContractName(address);
  if (name) return getContract(name);
  else return null;
}

// Search for core contract name by address
export function getContractName(address) {
  if (!address) return null;
  const contractNames = Object.keys(config.contractAddresses); // Object.keys loses types
  for (const name of contractNames) {
    const cAddress = config.contractAddresses[name];
    if (areAddressesEqual(address, cAddress)) {
      return name;
    }
  }
  return null;
}

let erc721Interface;

// Normally, interfaces are retrieved through the getContract() function
// but ERC721 is an exception because no core celo contracts use it
export function getErc721AbiInterface() {
  if (!erc721Interface) {
    erc721Interface = new utils.Interface(Erc721Abi);
  }
  return erc721Interface;
}

// Necessary if the signer changes, as in after a logout
export function clearContractCache() {
  contractCache = {};
  tokenContractCache = {};
}
