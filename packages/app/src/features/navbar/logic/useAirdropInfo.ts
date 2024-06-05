import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { airdropInfo } from '@/domain/wallet/airdropInfo'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { useTimestamp } from '@/utils/useTimestamp'
import { Airdrop, AirdropInfo } from '../types'

export function useAirdropInfo(): AirdropInfo {
  const { address } = useAccount()
  const { timestamp } = useTimestamp()

  const result = useQuery(airdropInfo(address && CheckedAddress(address)))

  const airdrop = result.data ? getCorrectedAirdrop(result.data, timestamp) : undefined
  const isLoading = result.isLoading
  const isError = result.isError

  return {
    airdrop,
    isLoading,
    isError,
  }
}

function getCorrectedAirdrop(airdrop: Airdrop, timestamp: number): Airdrop {
  const timeElapsed = timestamp > airdrop.timestamp ? timestamp - airdrop.timestamp : 0
  const tokensFromSnapshot = airdrop.tokenRate.multipliedBy(timeElapsed)
  const tokenReward = NormalizedUnitNumber(airdrop.tokenReward.plus(tokensFromSnapshot))
  return {
    ...airdrop,
    tokenReward,
  }
}
