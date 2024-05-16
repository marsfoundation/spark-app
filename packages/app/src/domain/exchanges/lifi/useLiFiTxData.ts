import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useConnectedAddress } from '@/domain/wallet/useConnectedAddress'

import { useOriginChainId } from '../../hooks/useOriginChainId'
import { SwapInfo, SwapParams } from '../types'
import { LiFiClient } from './LifiClient'
import { fetchLiFiTxData } from './query'

export interface UseLiFiTxDataParams {
  swapParams: SwapParams
  enabled?: boolean
}

export function useLiFiTxData({ swapParams, enabled = true }: UseLiFiTxDataParams): SwapInfo {
  const { account } = useConnectedAddress()
  const chainId = useOriginChainId()

  const client = useMemo(() => new LiFiClient(), [])

  const amount =
    swapParams.type === 'direct'
      ? swapParams.fromToken.toBaseUnit(swapParams.value)
      : swapParams.toToken.toBaseUnit(swapParams.value)

  return useQuery({
    ...fetchLiFiTxData({
      client,
      type: swapParams.type,
      fromToken: swapParams.fromToken.address,
      toToken: swapParams.toToken.address,
      amount,
      chainId,
      userAddress: account,
      meta: swapParams.meta,
    }),
    enabled: enabled && amount.gt(0),
  })
}
