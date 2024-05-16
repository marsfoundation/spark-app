import { waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { daiLikeReserve, testAddresses, testTokens } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'

import { defaultExchangeMaxSlippage } from '../state/actions-settings'
import {
  LIFI_DEFAULT_FEE,
  LIFI_DEFAULT_FEE_INTEGRATOR_KEY,
  LIFI_WAIVED_FEE,
  LIFI_WAIVED_FEE_INTEGRATOR_KEY,
} from './evaluateSwap'
import { LifiQuoteRequestParams, LifiReverseQuoteRequestParams } from './lifi/LifiClient'
import { useSwap } from './useSwap'

const chainId = 1
const account = testAddresses.alice
const { DAI, USDC, USDT, sDAI } = testTokens
const amount = NormalizedUnitNumber(1)

const hookRenderer = setupHookRenderer({
  hook: useSwap,
  account,
  handlers: [handlers.chainIdCall({ chainId })],
  args: {
    swapParamsBase: {
      type: 'direct',
      fromToken: DAI,
      toToken: sDAI,
      value: amount,
    },
    defaults: { defaultMaxSlippage: defaultExchangeMaxSlippage },
  },
})

describe.only(useSwap, () => {
  let mockFetch = vi.fn()
  beforeEach(() => {
    mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('DAI to sDAI', async () => {
    hookRenderer()

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWithURL('https://li.quest/v1/quote')
    })

    expect(mockFetch).toHaveBeenCalledWithURLParams({
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: account,
      fromAmount: daiLikeReserve.token.toBaseUnit(amount).toString(),
      slippage: defaultExchangeMaxSlippage.toString(),
      integrator: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
      fee: LIFI_WAIVED_FEE.toString(),
      fromToken: DAI.address,
      toToken: sDAI.address,
    } satisfies LifiQuoteRequestParams)
  })

  it('USDC to sDAI', async () => {
    hookRenderer({
      args: {
        swapParamsBase: {
          type: 'direct',
          fromToken: USDC,
          toToken: sDAI,
          value: amount,
        },
        defaults: { defaultMaxSlippage: defaultExchangeMaxSlippage },
      },
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWithURL('https://li.quest/v1/quote')
    })

    expect(mockFetch).toHaveBeenCalledWithURLParams({
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: account,
      fromAmount: USDC.toBaseUnit(amount).toString(),
      slippage: defaultExchangeMaxSlippage.toString(),
      integrator: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
      fee: LIFI_WAIVED_FEE.toString(),
      fromToken: USDC.address,
      toToken: sDAI.address,
    } satisfies LifiQuoteRequestParams)
  })

  it('USDT to sDAI', async () => {
    hookRenderer({
      args: {
        swapParamsBase: {
          type: 'direct',
          fromToken: USDT,
          toToken: sDAI,
          value: amount,
        },
        defaults: { defaultMaxSlippage: defaultExchangeMaxSlippage },
      },
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWithURL('https://li.quest/v1/quote')
    })

    expect(mockFetch).toHaveBeenCalledWithURLParams({
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: account,
      fromAmount: USDT.toBaseUnit(amount).toString(),
      slippage: defaultExchangeMaxSlippage.toString(),
      integrator: LIFI_DEFAULT_FEE_INTEGRATOR_KEY,
      fee: LIFI_DEFAULT_FEE.toString(),
      fromToken: USDT.address,
      toToken: sDAI.address,
    } satisfies LifiQuoteRequestParams)
  })

  it('sDAI to DAI', async () => {
    hookRenderer({
      args: {
        swapParamsBase: {
          type: 'reverse',
          fromToken: sDAI,
          toToken: DAI,
          value: amount,
        },
        defaults: { defaultMaxSlippage: defaultExchangeMaxSlippage },
      },
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWithURL('https://li.quest/v1/quote/contractCalls')
    })

    expect(mockFetch).toHaveBeenCalledWithBodyParams({
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: account,
      toAmount: DAI.toBaseUnit(amount).toString(),
      slippage: defaultExchangeMaxSlippage.toString(),
      integrator: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
      fee: LIFI_WAIVED_FEE.toString(),
      fromToken: sDAI.address,
      toToken: DAI.address,
    } satisfies Omit<LifiReverseQuoteRequestParams, 'contractCalls'>)
  })
  it('sDAI to USDC', async () => {
    hookRenderer({
      args: {
        swapParamsBase: {
          type: 'reverse',
          fromToken: sDAI,
          toToken: USDC,
          value: amount,
        },
        defaults: { defaultMaxSlippage: defaultExchangeMaxSlippage },
      },
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWithURL('https://li.quest/v1/quote/contractCalls')
    })

    expect(mockFetch).toHaveBeenCalledWithBodyParams({
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: account,
      toAmount: USDC.toBaseUnit(amount).toString(),
      slippage: defaultExchangeMaxSlippage.toString(),
      integrator: LIFI_WAIVED_FEE_INTEGRATOR_KEY,
      fee: LIFI_WAIVED_FEE.toString(),
      fromToken: sDAI.address,
      toToken: USDC.address,
    } satisfies Omit<LifiReverseQuoteRequestParams, 'contractCalls'>)
  })
  it('sDAI to USDT', async () => {
    hookRenderer({
      args: {
        swapParamsBase: {
          type: 'reverse',
          fromToken: sDAI,
          toToken: USDT,
          value: amount,
        },
        defaults: { defaultMaxSlippage: defaultExchangeMaxSlippage },
      },
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWithURL('https://li.quest/v1/quote/contractCalls')
    })

    expect(mockFetch).toHaveBeenCalledWithBodyParams({
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: account,
      toAmount: USDT.toBaseUnit(amount).toString(),
      slippage: defaultExchangeMaxSlippage.toString(),
      integrator: LIFI_DEFAULT_FEE_INTEGRATOR_KEY,
      fee: LIFI_DEFAULT_FEE.toString(),
      fromToken: sDAI.address,
      toToken: USDT.address,
    } satisfies Omit<LifiReverseQuoteRequestParams, 'contractCalls'>)
  })

  // it('selects dynamic max slippage for waived routes')
  // it('respects chainId')
  // it('respects defaultMaxSlippage')
})
