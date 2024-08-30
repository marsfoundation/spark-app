import { CheckedAddress } from '../types/CheckedAddress'

const USDS_TESTNET_ADDRESS_MAPPING: Record<CheckedAddress, CheckedAddress> = {
  [CheckedAddress('0x8AFB0C54bAE39A5e56b984DF1C4b5702b2abf205')]: CheckedAddress(
    '0x5eeb3d8d60b06a44f6124a84eee7ec0bb747be6d',
  ),
}

export function mapToInfoSkyAddress(address: CheckedAddress): CheckedAddress {
  return USDS_TESTNET_ADDRESS_MAPPING[address] ?? address
}
