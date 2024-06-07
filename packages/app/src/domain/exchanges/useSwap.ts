import { getChainConfigEntry } from '@/config/chain'

import { useOriginChainId } from '../hooks/useOriginChainId'
import { Percentage } from '../types/NumericValues'
import { evaluateSwap } from './evaluateSwap'
import { useLiFiTxData } from './lifi/useLiFiTxData'
import { SwapInfo, SwapParams, SwapParamsBase } from './types'

interface UseSwapArgs {
  swapParamsBase: SwapParamsBase
  defaults: { defaultMaxSlippage: Percentage }
  enabled?: boolean
}

export function useSwap({ swapParamsBase, defaults, enabled }: UseSwapArgs): {
  swapInfo: SwapInfo
  swapParams: SwapParams
} {
  const chainId = useOriginChainId()
  const waivedRoutes = getChainConfigEntry(chainId).lifiRoutesWithWaivedFees

  const swapParams: SwapParams = {
    ...swapParamsBase,
    meta: evaluateSwap(swapParamsBase, { maxSlippage: defaults.defaultMaxSlippage }, waivedRoutes),
  }
  const swapInfo = useLiFiTxData({
    swapParams,
    enabled,
  })

  return { swapParams, swapInfo }
}
