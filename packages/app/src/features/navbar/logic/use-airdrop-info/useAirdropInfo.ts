import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { airdropInfo } from '@/domain/wallet/airdropInfo'
import { useTimestamp } from '@/utils/useTimestamp'
import { AirdropInfo } from '../../types'
import { adjustAirdropValue } from './adjustAirdropValue'

export function useAirdropInfo(): AirdropInfo {
  const { address } = useAccount()
  const { timestamp } = useTimestamp()

  const result = useQuery(airdropInfo(address && CheckedAddress(address)))

  const airdrop = result.data ? { ...result.data, tokenReward: adjustAirdropValue(result.data, timestamp) } : undefined
  const isLoading = result.isLoading
  const isError = result.isError

  return {
    airdrop,
    isLoading,
    isError,
  }
}
