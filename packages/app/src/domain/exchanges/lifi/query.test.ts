import { mainnet } from 'viem/chains'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { BaseUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { queryClient } from '@/test/integration/query-client'

import { LiFi } from './lifi'
import { MockLifiQueryMetaEvaluator } from './meta'
import { fetchLiFiTxData } from './query'
import { QuoteResponseRaw } from './types'

const token1 = testAddresses.token
const token2 = testAddresses.token2
const userAddress = testAddresses.alice
const chainId = mainnet.id

describe(fetchLiFiTxData.name, () => {
  const queryMetaEvaluator = new MockLifiQueryMetaEvaluator()
  const lifiClient = new LiFi({ chainId, userAddress })

  describe('http request', () => {
    function assertQueryParams(url: URL, expectedParams: Record<string, string>): void {
      for (const [key, value] of Object.entries(expectedParams)) {
        expect(url.searchParams.get(key), `Non-matching key: ${key}`).toStrictEqual(value)
      }

      for (const key of url.searchParams.keys()) {
        expect(expectedParams[key], `Key ${key} was present in URL but not in expected params`).toBeDefined()
      }
    }

    function assertRequestBody(request: RequestInit, expectedParams: Record<string, any>): void {
      expect(request.body).toBeDefined()
      const parsedBody = JSON.parse(request!.body as any) as any

      for (const [key, value] of Object.entries(expectedParams)) {
        expect(parsedBody[key], `Non-matching key: ${key}`).toStrictEqual(value)
      }

      for (const key of Object.keys(parsedBody)) {
        expect(expectedParams[key], `Key ${key} was present in body but not in expected params`).toBeDefined()
      }
    }

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    test('direct', async () => {
      const amount = BaseUnitNumber(1)
      const maxSlippage = Percentage(0.005)

      let calledUrl: URL | string | undefined
      let request: RequestInit | undefined

      vi.stubGlobal('fetch', async (...args: any[]) => {
        calledUrl = args[0]
        request = args[1]

        return {
          ok: false,
          json: async () => ({}),
        }
      })

      await queryClient
        .fetchQuery(
          fetchLiFiTxData({
            client: lifiClient,
            fromToken: token1,
            toToken: token2,
            maxSlippage,
            amount,
            type: 'direct',
            queryMetaEvaluator,
          }),
        )
        .catch(() => {}) // ignore errors

      expect(calledUrl).toBeDefined()

      const calledUrlObj = new URL(calledUrl!.toString())
      expect(calledUrlObj.origin).toBe('https://li.quest')
      expect(calledUrlObj.pathname).toBe('/v1/quote')
      expect(request).toBe(undefined) // GET request

      const expectedQueryParams: Record<string, string> = {
        fromChain: chainId.toString(),
        toChain: chainId.toString(),
        fromAddress: userAddress,
        fromToken: token1,
        fromAmount: amount.toFixed(),
        toToken: token2,
        slippage: maxSlippage.toFixed(),
        integrator: queryMetaEvaluator.evaluate().meta.integratorKey,
        fee: queryMetaEvaluator.evaluate().meta.fee.toFixed(),
      }
      assertQueryParams(calledUrlObj, expectedQueryParams)
    })

    test('reverse', async () => {
      const amount = BaseUnitNumber(1)
      const maxSlippage = Percentage(0.005)

      let calledUrl: URL | string | undefined
      let request: RequestInit | undefined

      vi.stubGlobal('fetch', async (...args: any[]) => {
        calledUrl = args[0]
        request = args[1]

        return {
          ok: false,
          json: async () => ({}),
        }
      })

      await queryClient
        .fetchQuery(
          fetchLiFiTxData({
            client: lifiClient,
            fromToken: token1,
            toToken: token2,
            maxSlippage,
            amount,
            type: 'reverse',
            queryMetaEvaluator,
          }),
        )
        .catch(() => {}) // ignore errors

      expect(calledUrl).toBeDefined()
      expect(request).toBeDefined()

      const calledUrlObj = new URL(calledUrl!.toString())
      expect(calledUrlObj.origin).toBe('https://li.quest')
      expect(calledUrlObj.pathname).toBe('/v1/quote/contractCalls')
      expect(request?.method).toBe('POST')

      const expectedBody: Record<string, any> = {
        fromChain: chainId.toString(),
        toChain: chainId.toString(),
        fromAddress: userAddress,
        fromToken: token1,
        toToken: token2,
        toAmount: amount.toFixed(),
        slippage: maxSlippage.toFixed(),
        integrator: queryMetaEvaluator.evaluate().meta.integratorKey,
        fee: queryMetaEvaluator.evaluate().meta.fee.toFixed(),
        contractCalls: [],
      }
      assertRequestBody(request!, expectedBody)
    })
  })

  describe('response parsing', () => {
    test('direct', async () => {
      const amount = BaseUnitNumber(1)
      const maxSlippage = Percentage(0.005)
      const rawResponse: QuoteResponseRaw = {
        transactionRequest: {
          data: '0x4630a0d8', // just a sighash
          from: userAddress,
          to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          value: '0x0',
          gasPrice: '0xe1a0aa5f1',
          gasLimit: '0x75d63',
        },
        estimate: {
          feeCosts: [{ amountUSD: 1 }],
          fromAmount: amount.toFixed(),
          toAmount: '1',
        },
        action: {
          fromToken: { address: token1 },
          toToken: { address: token2 },
          slippage: maxSlippage.toNumber(),
        },
      }

      vi.stubGlobal('fetch', async () => {
        return {
          ok: true,
          json: async () => rawResponse,
        }
      })

      const result = await queryClient.fetchQuery(
        fetchLiFiTxData({
          client: lifiClient,
          fromToken: token1,
          toToken: token2,
          maxSlippage,
          amount,
          type: 'direct',
          queryMetaEvaluator,
        }),
      )

      expect(result).toStrictEqual({
        txRequest: {
          ...rawResponse.transactionRequest,
          value: BigInt(rawResponse.transactionRequest.value),
          gasPrice: BigInt(rawResponse.transactionRequest.gasPrice),
          gasLimit: BigInt(rawResponse.transactionRequest.gasLimit),
        },
        fromToken: rawResponse.action.fromToken.address,
        toToken: rawResponse.action.toToken.address,
        type: 'direct',
        estimate: {
          fromAmount: BaseUnitNumber(rawResponse.estimate.fromAmount),
          toAmount: BaseUnitNumber(rawResponse.estimate.toAmount),
          feeCostsUSD: BaseUnitNumber(rawResponse.estimate.feeCosts[0]!.amountUSD),
        },
      })
    })

    test('reverse', async () => {
      const amount = BaseUnitNumber(1)
      const maxSlippage = Percentage(0.005)
      const rawResponse: QuoteResponseRaw = {
        transactionRequest: {
          data: '0x4630a0d8', // just a sighash
          from: userAddress,
          to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
          value: '0x0',
          gasPrice: '0xe1a0aa5f1',
          gasLimit: '0x75d63',
        },
        estimate: {
          feeCosts: [{ amountUSD: 1 }],
          fromAmount: amount.toFixed(),
          toAmount: '1',
        },
        action: {
          fromToken: { address: token1 },
          toToken: { address: token2 },
          slippage: maxSlippage.toNumber(),
        },
      }

      vi.stubGlobal('fetch', async () => {
        return {
          ok: true,
          json: async () => rawResponse,
        }
      })

      const result = await queryClient.fetchQuery(
        fetchLiFiTxData({
          client: lifiClient,
          fromToken: token1,
          toToken: token2,
          maxSlippage,
          amount,
          type: 'reverse',
          queryMetaEvaluator,
        }),
      )

      expect(result).toStrictEqual({
        txRequest: {
          ...rawResponse.transactionRequest,
          value: BigInt(rawResponse.transactionRequest.value),
          gasPrice: BigInt(rawResponse.transactionRequest.gasPrice),
          gasLimit: BigInt(rawResponse.transactionRequest.gasLimit),
        },
        fromToken: rawResponse.action.fromToken.address,
        toToken: rawResponse.action.toToken.address,
        type: 'reverse',
        estimate: {
          fromAmount: BaseUnitNumber(rawResponse.estimate.fromAmount),
          toAmount: BaseUnitNumber(rawResponse.estimate.toAmount),
          feeCostsUSD: BaseUnitNumber(rawResponse.estimate.feeCosts[0]!.amountUSD),
        },
      })
    })
  })
})
