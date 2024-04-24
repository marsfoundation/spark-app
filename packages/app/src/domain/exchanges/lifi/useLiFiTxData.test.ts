import { tokens } from '@storybook/tokens'
import { QueryClient } from '@tanstack/react-query'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'

import { BaseUnitNumber, NormalizedUnitNumber, Percentage } from '../../types/NumericValues'
import { SwapRequest } from '../types'
import { MockLifiQueryMetaEvaluator } from './meta'
import { QuoteResponseRaw } from './types'
import { useLiFiTxData } from './useLiFiTxData'

const account = testAddresses.alice
const fromToken = tokens.USDC
const toToken = tokens.sDAI
const amount = BaseUnitNumber(10_000_000_000)
const amountNormalized = fromToken.fromBaseUnit(amount)
const chainId = mainnet.id
const maxSlippage = Percentage(0.005)
const rawResponse: QuoteResponseRaw = {
  transactionRequest: {
    data: '0x4630a0d8', // just a sighash
    from: account,
    to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
    value: '0x0',
    gasPrice: '0xe1a0aa5f1',
    gasLimit: '0x75d63',
  },
  estimate: {
    feeCosts: [{ amountUSD: 1 }],
    fromAmount: amount.toString(),
    toAmount: '943000000000000000',
  },
  action: {
    fromToken: { address: fromToken.address },
    toToken: { address: toToken.address },
  },
}

const hookRenderer = setupHookRenderer({
  hook: useLiFiTxData,
  account,
  handlers: [handlers.chainIdCall({ chainId })],
  args: {
    swapParams: { fromToken, toToken, value: amountNormalized, type: 'direct', maxSlippage },
    queryMetaEvaluator: new MockLifiQueryMetaEvaluator(),
  },
})

describe(useLiFiTxData.name, () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('fetches direct quote', async () => {
    let calledUrl: URL | string | undefined

    vi.stubGlobal('fetch', async (...args: any[]) => {
      calledUrl = args[0]

      return {
        ok: true,
        json: async () => rawResponse,
      }
    })

    const { result } = hookRenderer()

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })

    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual({
      txRequest: {
        data: rawResponse.transactionRequest.data,
        from: account,
        to: rawResponse.transactionRequest.to,
        value: BigInt(rawResponse.transactionRequest.value),
        gasPrice: BigInt(rawResponse.transactionRequest.gasPrice),
        gasLimit: BigInt(rawResponse.transactionRequest.gasLimit),
      },
      estimate: {
        feeCostsUSD: NormalizedUnitNumber(1),
        fromAmount: amount,
        toAmount: BaseUnitNumber(943000000000000000n),
      },
      fromToken: fromToken.address,
      toToken: toToken.address,
      type: 'direct',
    } satisfies SwapRequest)

    expect(calledUrl).toBeDefined()
    const calledUrlObj = new URL(calledUrl!.toString())

    expect(calledUrlObj.pathname).toBe('/v1/quote')
  })

  test('fetches reverse quote', async () => {
    let calledUrl: URL | string | undefined

    vi.stubGlobal('fetch', async (...args: any[]) => {
      calledUrl = args[0]

      return {
        ok: true,
        json: async () => rawResponse,
      }
    })

    const { result } = hookRenderer({
      args: {
        swapParams: { fromToken, toToken, value: amountNormalized, type: 'reverse', maxSlippage },
        queryMetaEvaluator: new MockLifiQueryMetaEvaluator(),
      },
    })

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })

    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual({
      txRequest: {
        data: rawResponse.transactionRequest.data as any,
        from: account,
        to: rawResponse.transactionRequest.to as any,
        value: BigInt(rawResponse.transactionRequest.value),
        gasPrice: BigInt(rawResponse.transactionRequest.gasPrice),
        gasLimit: BigInt(rawResponse.transactionRequest.gasLimit),
      },
      estimate: {
        feeCostsUSD: NormalizedUnitNumber(1),
        fromAmount: amount,
        toAmount: BaseUnitNumber(943000000000000000n),
      },
      fromToken: fromToken.address,
      toToken: toToken.address,
      type: 'reverse',
    } satisfies SwapRequest)

    expect(calledUrl).toBeDefined()
    const calledUrlObj = new URL(calledUrl!.toString())

    expect(calledUrlObj.pathname).toBe('/v1/quote/contractCalls')
  })

  test('returns error when fetch fails', async () => {
    vi.stubGlobal('fetch', async () => {
      return {
        ok: false,
        json: async () => {},
      }
    })

    const { result } = hookRenderer()

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })

    expect(result.current.data).toBeUndefined()
    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBeInstanceOf(Error)
  })

  test('retries when fetch fails', async () => {
    let fetchCount = 0

    vi.stubGlobal('fetch', async () => {
      fetchCount++

      if (fetchCount === 1) {
        return {
          ok: false,
          json: async () => {},
        }
      }
      return {
        ok: true,
        json: async () => rawResponse,
      }
    })

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retryDelay: 0,
        },
      },
    })
    const { result } = hookRenderer({ queryClient })

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })

    expect(fetchCount).toBe(2)
    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual({
      txRequest: {
        data: rawResponse.transactionRequest.data as any,
        from: account,
        to: rawResponse.transactionRequest.to as any,
        value: BigInt(rawResponse.transactionRequest.value),
        gasPrice: BigInt(rawResponse.transactionRequest.gasPrice),
        gasLimit: BigInt(rawResponse.transactionRequest.gasLimit),
      },
      estimate: {
        feeCostsUSD: NormalizedUnitNumber(1),
        fromAmount: amount,
        toAmount: BaseUnitNumber(943000000000000000n),
      },
      fromToken: fromToken.address,
      toToken: toToken.address,
      type: 'direct',
    } satisfies SwapRequest)
  })
})
