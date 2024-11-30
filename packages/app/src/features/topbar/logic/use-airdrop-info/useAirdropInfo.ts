import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { airdropInfo } from '@/features/navbar/logic/use-airdrop-info/airdropInfo'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { TopbarAirdropProps } from '../../components/topbar-airdrop/TopbarAirdrop'
import { extendAirdropResponse } from './utils/extendAirdropResponse'

interface UseAirdropInfoParams {
  refreshIntervalInMs: number
}

export function useAirdropInfo({ refreshIntervalInMs }: UseAirdropInfoParams): TopbarAirdropProps {
  const { address } = useAccount()

  const result = useQuery(airdropInfo(address && CheckedAddress(address)))

  const airdrop = extendAirdropResponse({ airdropInfoResponse: result.data, refreshIntervalInMs })
  const isLoading = result.isLoading
  const isError = result.isError

  return {
    airdrop,
    isLoading,
    isError,
  }
}
