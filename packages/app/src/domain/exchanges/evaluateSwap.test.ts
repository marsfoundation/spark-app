import { LifiWaivedRoutes } from '@/config/chain/types'
import { testTokens } from '@/test/integration/constants'

import { defaultExchangeMaxSlippage } from '../state/actions-settings'
import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import {
  evaluateSwap,
  LIFI_DEFAULT_FEE,
  LIFI_DEFAULT_FEE_INTEGRATOR_KEY,
  LIFI_WAIVED_ALLOWED_EXCHANGES,
  LIFI_WAIVED_FEE,
  LIFI_WAIVED_FEE_INTEGRATOR_KEY,
  LIFI_WAIVED_MAX_PRICE_IMPACT,
} from './evaluateSwap'
import { SwapMeta, SwapParamsBase } from './types'

const { token1, token2, token3, token4 } = testTokens

const baseSwap: SwapParamsBase = {
  fromToken: token1,
  toToken: token2,
  value: NormalizedUnitNumber(1),
  type: 'direct',
}

const nativeRoutes = [
  [token1.symbol, token2.symbol],
  [token1.symbol, token3.symbol],
] as LifiWaivedRoutes

describe(evaluateSwap.name, () => {
  describe('native routes', () => {
    it('detects native routes', () => {
      function assertIsNativeRoute(swapOverrides: Partial<SwapParamsBase>): void {
        const result = evaluateSwap(
          { ...baseSwap, ...swapOverrides },
          { maxSlippage: defaultExchangeMaxSlippage },
          nativeRoutes,
        )

        expect(result).toEqual({
          fee: LIFI_WAIVED_FEE,
          maxSlippage: defaultExchangeMaxSlippage,
          allowedExchanges: LIFI_WAIVED_ALLOWED_EXCHANGES,
          maxPriceImpact: LIFI_WAIVED_MAX_PRICE_IMPACT,
          integratorKey: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
        } satisfies SwapMeta)
      }

      assertIsNativeRoute({ fromToken: token1, toToken: token2 })
      assertIsNativeRoute({ fromToken: token2, toToken: token1 })
      assertIsNativeRoute({ fromToken: token1, toToken: token3 })
      assertIsNativeRoute({ fromToken: token3, toToken: token1 })
    })

    it('returns dynamic max slippage for dynamic routes', () => {
      function assertMaxSlippage(value: number, expectedMaxSlippage: Percentage): void {
        const result = evaluateSwap(
          {
            fromToken: token1,
            toToken: token2,
            type: 'direct',
            value: NormalizedUnitNumber(value),
          },
          { maxSlippage: defaultExchangeMaxSlippage },
          nativeRoutes,
        )
        expect(result.maxSlippage).toEqual(expectedMaxSlippage)
      }

      assertMaxSlippage(1, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(10, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(100, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(1_000, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(10_000, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(100_000, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(1_000_000, Percentage(0.0001))
      assertMaxSlippage(10_000_000, Percentage(0.00001))
    })
  })

  describe('non-native routes', () => {
    it('detects non-native routes', () => {
      function assertIsNotNativeRoute(swapOverrides: Partial<SwapParamsBase>): void {
        const result = evaluateSwap(
          { ...baseSwap, ...swapOverrides },
          { maxSlippage: defaultExchangeMaxSlippage },
          nativeRoutes,
        )

        expect(result).toEqual({
          fee: LIFI_DEFAULT_FEE,
          maxSlippage: defaultExchangeMaxSlippage,
          integratorKey: LIFI_DEFAULT_FEE_INTEGRATOR_KEY,
        } satisfies SwapMeta)
      }

      assertIsNotNativeRoute({ fromToken: token1, toToken: token4 })
      assertIsNotNativeRoute({ fromToken: token4, toToken: token1 })
      assertIsNotNativeRoute({ fromToken: token2, toToken: token4 })
    })

    it('doesnt change default max slippage', () => {
      function assertMaxSlippage(value: number, expectedMaxSlippage: Percentage): void {
        const result = evaluateSwap(
          {
            fromToken: token1,
            toToken: token4,
            type: 'direct',
            value: NormalizedUnitNumber(value),
          },
          { maxSlippage: defaultExchangeMaxSlippage },
          nativeRoutes,
        )
        expect(result.maxSlippage).toEqual(expectedMaxSlippage)
      }

      assertMaxSlippage(1, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(10, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(100, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(1_000, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(10_000, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(100_000, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(1_000_000, Percentage(defaultExchangeMaxSlippage))
      assertMaxSlippage(10_000_000, Percentage(defaultExchangeMaxSlippage))
    })
  })
})
