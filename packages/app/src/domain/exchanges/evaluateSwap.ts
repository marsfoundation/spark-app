import { SwapMeta, SwapParamsBase } from '@/domain/exchanges/types'
import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

// move to chain config
const nativeRoutes = [
  [TokenSymbol('DAI'), TokenSymbol('sDAI')],
  [TokenSymbol('USDC'), TokenSymbol('sDAI')],
]

export function evaluateSwap(swap: SwapParamsBase, defaults: Pick<SwapMeta, 'maxSlippage'>): SwapMeta {
  const isNativeSwap = nativeRoutes.some(
    (route) => route.includes(swap.fromToken.symbol) && route.includes(swap.toToken.symbol),
  )

  if (!isNativeSwap) {
    return {
      maxSlippage: defaults.maxSlippage,
      fee: LIFI_DEFAULT_FEE,
      integratorKey: LIFI_DEFAULT_FEE_INTEGRATOR_KEY,
    }
  }

  return {
    maxSlippage: defaults.maxSlippage,
    maxPriceImpact: LIFI_WAIVED_MAX_PRICE_IMPACT,
    fee: LIFI_WAIVED_FEE,
    integratorKey: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
    allowedExchanges: LIFI_WAIVED_ALLOWED_EXCHANGES,
  }
}

export const LIFI_DEFAULT_FEE_INTEGRATOR_KEY = 'spark_fee'
export const LIFI_DEFAULT_FEE = Percentage('0.002')

export const LIFI_WAIVED_FEE_INTEGRATOR_KEY = 'spark_waivefee'
export const LIFI_WAIVED_FEE = Percentage('0')

export const LIFI_WAIVED_ALLOWED_EXCHANGES = ['odos', 'enso', '1inch']
export const LIFI_WAIVED_MAX_PRICE_IMPACT = Percentage(0.005)
