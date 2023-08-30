import { utils } from 'ethers'

export function isValidAddress(address) {
  // Need to catch because ethers' isAddress throws in some cases (bad checksum)
  try {
    const isValid = address && utils.isAddress(address)
    return !!isValid
  } catch (error) {
    console.log('Invalid address', error, address)
    return false
  }
}

export function validateAddress(address, context) {
  if (!isValidAddress(address)) {
    const errorMsg = `Invalid addresses for ${context}: ${address}`
    console.log(errorMsg)
    throw new Error(errorMsg)
  }
}

export function normalizeAddress(address) {
  validateAddress(address, 'normalize')
  return utils.getAddress(address)
}

export function shortenAddress(address, elipsis, capitalize) {
  validateAddress(address, 'shorten')
  const addr = normalizeAddress(address)
  const shortened = addr.slice(0, 4) + (elipsis ? '...' : '') + addr.slice(38, 42)
  return capitalize ? capitalizeAddress(shortened) : shortened
}

export function capitalizeAddress(address) {
  return '0x' + address.substring(2).toUpperCase()
}

export function areAddressesEqual(a1, a2) {
  validateAddress(a1, 'compare')
  validateAddress(a2, 'compare')
  return utils.getAddress(a1) === utils.getAddress(a2)
}

export function trimLeading0x(input) {
  return input.startsWith('0x') ? input.substring(2) : input
}

export function ensureLeading0x(input) {
  return input.startsWith('0x') ? input : `0x${input}`
}
