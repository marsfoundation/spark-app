import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Percentage } from '@/domain/types/NumericValues'

import { EvaluateParams, EvaluateResult, LifiQueryMetaEvaluator } from '.'

export const LIFI_DEFAULT_FEE_INTEGRATOR_KEY = 'spark_fee'
export const LIFI_DEFAULT_FEE = Percentage('0.002')

export const LIFI_WAIVED_FEE_INTEGRATOR_KEY = 'spark_waivefee'
export const LIFI_WAIVED_FEE = Percentage('0')

export const LIFI_WAIVED_ALLOWED_EXCHANGES = ['odos', 'enso', '1inch']
export const LIFI_WAIVED_MAX_PRICE_IMPACT = Percentage(0.005)

export class RealLifiQueryMetaEvaluator implements LifiQueryMetaEvaluator {
  // all routes are bi-directional
  private readonly whitelistedRoutes: [CheckedAddress, CheckedAddress][]

  constructor({ dai, sdai, usdc }: { dai?: CheckedAddress; sdai?: CheckedAddress; usdc?: CheckedAddress } = {}) {
    this.whitelistedRoutes = [
      [sdai, dai],
      [usdc, dai],
      [usdc, sdai],
    ]
      .map((route) => (route.includes(undefined) ? undefined : route))
      .filter(Boolean) as any
  }

  evaluate({ fromToken, toToken }: EvaluateParams): EvaluateResult {
    const isWaivedRoute = this.whitelistedRoutes.some((route) => route.includes(fromToken) && route.includes(toToken))
    if (isWaivedRoute) {
      return {
        meta: {
          fee: LIFI_WAIVED_FEE,
          integratorKey: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
        },
        paramOverrides: {
          allowExchanges: LIFI_WAIVED_ALLOWED_EXCHANGES,
          maxPriceImpact: LIFI_WAIVED_MAX_PRICE_IMPACT,
        },
      }
    }

    return {
      meta: {
        fee: LIFI_DEFAULT_FEE,
        integratorKey: LIFI_DEFAULT_FEE_INTEGRATOR_KEY,
      },
      paramOverrides: {},
    }
  }
}
