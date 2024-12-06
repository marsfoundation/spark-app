import { Airdrop } from '@/features/topbar/types'
import { AirdropInfoResponse } from '../airdropInfo'
import { getTokenRatePrecision } from './getTokenRatePrecision'

export interface ExtendAirdropResponseParams {
  airdropInfoResponse: AirdropInfoResponse | undefined
  refreshIntervalInMs: number
}

export function extendAirdropResponse({
  airdropInfoResponse,
  refreshIntervalInMs,
}: ExtendAirdropResponseParams): Airdrop | undefined {
  if (!airdropInfoResponse) {
    return undefined
  }
  const tokenRatePrecision = getTokenRatePrecision({
    tokenRatePerSecond: airdropInfoResponse.tokenRatePerSecond,
    refreshIntervalInMs,
  })

  return {
    ...airdropInfoResponse,
    tokenRatePrecision,
    refreshIntervalInMs,
  }
}
