import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { airdropInfo } from '@/domain/wallet/airdropInfo'
import { useTimestamp } from '@/utils/useTimestamp'
import { AirdropInfo } from '../../types'
import { extendAirdropResponse } from './utils/extendAirdropResponse'

const refreshIntervalInMs = 100

export function useAirdropInfo(): AirdropInfo {
  const { address } = useAccount()
  const { timestamp: currentTimestamp } = useTimestamp()

  const result = useQuery(airdropInfo(address && CheckedAddress(address)))

  const airdrop = result.data
    ? extendAirdropResponse({ ...result.data, refreshIntervalInMs, currentTimestamp })
    : undefined
  const isLoading = result.isLoading
  const isError = result.isError

  return {
    airdrop,
    isLoading,
    isError,
  }
}
