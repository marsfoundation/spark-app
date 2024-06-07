import { Address } from 'viem'

import { raise } from '@/utils/assert'

import { useStore } from '../state'
import { CheckedAddress } from '../types/CheckedAddress'
import { getOriginChainId, useOriginChainId } from './useOriginChainId'

export function getContractAddress(addressMap: Record<number, Address>, chainId: number): CheckedAddress {
  const sandbox = useStore.getState().sandbox.network
  const originChainId = getOriginChainId(chainId, sandbox)

  const address = addressMap[originChainId] ?? raise(`Contract address for chain ${originChainId} not found`)
  return CheckedAddress(address)
}

export function useContractAddress(addressMap: Record<number, Address>): CheckedAddress {
  const chainId = useOriginChainId()
  return getContractAddress(addressMap, chainId)
}
