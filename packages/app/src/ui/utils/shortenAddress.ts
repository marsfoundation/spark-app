import { Address } from 'viem'

interface ShortenAddressOptions {
  startLength?: number
  endLength?: number
}

export function shortenAddress(
  address: Address,
  { startLength = 6, endLength = 4 }: ShortenAddressOptions = {},
): string {
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}
