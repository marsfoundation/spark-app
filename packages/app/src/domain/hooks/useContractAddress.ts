import { Address } from 'viem'

import { raise } from '@/utils/assert'

import { USDS_DEV_CHAIN_ID } from '@/config/chain/constants'
import {
  migrationActionsConfig,
  usdsPsmActionsConfig,
  usdsPsmWrapperConfig,
  usdsSkyRewardsConfig,
} from '@/config/contracts-generated'
import { mainnet } from 'viem/chains'
import { useStore } from '../state'
import { CheckedAddress } from '../types/CheckedAddress'
import { getOriginChainId, useOriginChainId } from './useOriginChainId'

export function getOptionalContractAddress(
  addressMap: Record<number, Address>,
  chainId: number,
): CheckedAddress | null {
  const sandbox = useStore.getState().sandbox.network
  const originChainId = getOriginChainId(chainId, sandbox)

  const address = addressMap[originChainId]
  if (chainId === USDS_DEV_CHAIN_ID) {
    return mapMainnetAddressToDevnet(address)
  }

  return address ? CheckedAddress(address) : null
}

export function getContractAddress(addressMap: Record<number, Address>, chainId: number): CheckedAddress {
  const address = getOptionalContractAddress(addressMap, chainId)

  return address ?? raise(`Contract address for chain ${chainId} not found`)
}

export function useContractAddress(addressMap: Record<number, Address>): CheckedAddress {
  const chainId = useOriginChainId()
  return getContractAddress(addressMap, chainId)
}

function mapMainnetAddressToDevnet(address: Address | undefined): CheckedAddress | null {
  const MIGRATE_ACTIONS_ADDRESS = CheckedAddress('0x50f1a6C941E68701D774b5B81B7124865cBc6f0a')
  const STAKING_REWARDS_USDS_ADDRESS = CheckedAddress('0x8AFB0C54bAE39A5e56b984DF1C4b5702b2abf205')
  const USDS_PSM_ACTIONS = CheckedAddress('0x28e4B8BE2748E9BD4b9cEAc4E05069E58773Af7E')
  const USDS_PSM_WRAPPER = CheckedAddress('0x9581c795DBcaf408E477F6f1908a41BE43093122')

  switch (address) {
    case migrationActionsConfig.address[mainnet.id]:
      return MIGRATE_ACTIONS_ADDRESS
    case usdsPsmActionsConfig.address[mainnet.id]:
      return USDS_PSM_ACTIONS
    case usdsPsmWrapperConfig.address[mainnet.id]:
      return USDS_PSM_WRAPPER
    case usdsSkyRewardsConfig.address[mainnet.id]:
      return STAKING_REWARDS_USDS_ADDRESS
  }

  if (!address) {
    return null
  }

  return CheckedAddress(address)
}
