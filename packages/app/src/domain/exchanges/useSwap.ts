import { getChainConfigEntry } from '@/config/chain'

import { useOriginChainId } from '../hooks/useOriginChainId'
import { Percentage } from '../types/NumericValues'
import { evaluateSwap } from './evaluateSwap'
import { useLiFiTxData } from './lifi/useLiFiTxData'
import { SwapInfo, SwapParams, SwapParamsBase } from './types'

interface UseSwapArgs {
  swapParamsBase: SwapParamsBase
  defaults: { defaultMaxSlippage: Percentage }
}

export function useSwap({ swapParamsBase, defaults }: UseSwapArgs): {
  swapInfo: SwapInfo
  swapParams: SwapParams
} {
  const chainId = useOriginChainId()
  const nativeRoutes = getChainConfigEntry(chainId).lifiRoutesWithWaivedFees

  const swapParams: SwapParams = {
    ...swapParamsBase,
    meta: evaluateSwap(swapParamsBase, { maxSlippage: defaults.defaultMaxSlippage }, nativeRoutes),
  }
  const swapInfo = useLiFiTxData({
    swapParams,
  })

  return { swapParams, swapInfo }
}
