import { erc4626Abi } from 'viem'
import { CheckedAddress } from '../types/CheckedAddress'

export interface Vault {
  address: CheckedAddress
  abi: typeof erc4626Abi
}
