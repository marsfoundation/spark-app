import { mainnet } from 'viem/chains'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { testAddresses } from '@/test/integration/constants'

import { CheckedAddress } from '../../types/CheckedAddress'
import { BaseUnitNumber, Percentage } from '../../types/NumericValues'
import { LiFi } from './lifi'
import { QuoteResponseRaw } from './types'

const userAddress = testAddresses.alice
const chainId = mainnet.id
const USDC = CheckedAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48') // USDC
const sDAI = CheckedAddress('0x83f20f44975d03b1b09e64809b757c47f942beea') // sDAI
const amount = BaseUnitNumber('1000000000')
const maxSlippage = Percentage(0.005)
const maxSlippageAsString = '0.005'
const meta = { fee: Percentage(0), integratorKey: 'test' }

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
    fromAmount: '1000000000000000000',
    toAmount: '943000000000000000',
  },
  action: {
    fromToken: { address: USDC },
    toToken: { address: sDAI },
  },
}

describe('LiFi', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe(LiFi.prototype.getQuote.name, () => {
    test('calls fetch with the correct URL', async () => {
      let calledUrl: URL | string | undefined
      vi.stubGlobal('fetch', async (...args: any[]) => {
        calledUrl = args[0]

        return {
          ok: false,
          json: async () => ({}),
        }
      })

      const lifi = new LiFi({
        chainId,
        userAddress,
      })

      await lifi
        .getQuote({
          fromToken: USDC,
          toToken: sDAI,
          amount,
          meta,
          maxSlippage,
        })
        .catch(() => {}) // ignore error

      expect(calledUrl).toBeDefined()
      const calledUrlObj = new URL(calledUrl!.toString())

      expect(calledUrlObj.searchParams.get('fromChain')).toBe(chainId.toString())
      expect(calledUrlObj.searchParams.get('toChain')).toBe(chainId.toString())
      expect(calledUrlObj.searchParams.get('fromAddress')).toBe(userAddress)
      expect(calledUrlObj.searchParams.get('fromToken')).toBe(USDC)
      expect(calledUrlObj.searchParams.get('fromAmount')).toBe(amount.toString())
      expect(calledUrlObj.searchParams.get('toToken')).toBe(sDAI)
      expect(calledUrlObj.searchParams.get('slippage')).toBe(maxSlippageAsString)
      expect(calledUrlObj.origin).toBe('https://li.quest')
      expect(calledUrlObj.pathname).toBe('/v1/quote')
    })

    test('throws error if fetch fails', async () => {
      vi.stubGlobal('fetch', async () => {
        return {
          ok: false,
          json: async () => ({}),
        }
      })

      const lifi = new LiFi({
        chainId,
        userAddress,
      })

      await expect(
        lifi.getQuote({
          fromToken: USDC,
          toToken: sDAI,
          amount,
          meta,
          maxSlippage,
        }),
      ).rejects.toThrow()
    })

    test('parses response', async () => {
      vi.stubGlobal('fetch', async () => {
        return {
          ok: true,
          json: async () => rawResponse,
        }
      })

      const lifi = new LiFi({
        chainId,
        userAddress,
      })

      const response = await lifi.getQuote({
        fromToken: USDC,
        toToken: sDAI,
        amount,
        meta,
        maxSlippage,
      })

      expect(response).toEqual({
        transactionRequest: {
          data: rawResponse.transactionRequest.data,
          from: userAddress,
          to: rawResponse.transactionRequest.to,
          value: BigInt(rawResponse.transactionRequest.value),
          gasPrice: BigInt(rawResponse.transactionRequest.gasPrice),
          gasLimit: BigInt(rawResponse.transactionRequest.gasLimit),
        },
        estimate: {
          feeCosts: [{ amountUSD: 1 }],
          fromAmount: 1000000000000000000n,
          toAmount: 943000000000000000n,
        },
        action: {
          fromToken: { address: USDC },
          toToken: { address: sDAI },
        },
      })
    })

    test('throws error if response is not valid', async () => {
      const responseData = {
        data: '0x', // empty data
        from: userAddress,
        to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
        value: '0x0',
        gasPrice: '0xe1a0aa5f1',
        gasLimit: '0x75d63',
        chainId: 1,
      }

      vi.stubGlobal('fetch', async () => {
        return {
          ok: true,
          json: async () => ({
            transactionRequest: responseData,
          }),
        }
      })

      const lifi = new LiFi({
        chainId,
        userAddress,
      })

      await expect(
        lifi.getQuote({
          fromToken: USDC,
          toToken: sDAI,
          amount,
          meta,
          maxSlippage,
        }),
      ).rejects.toThrow()
    })
  })

  describe(LiFi.prototype.getReverseQuote.name, () => {
    test('calls fetch witch correct url, method and options', async () => {
      let calledUrl: URL | string | undefined
      let calledOptions: RequestInit | undefined

      vi.stubGlobal('fetch', async (...args: any[]) => {
        calledUrl = args[0]
        calledOptions = args[1]

        return {
          ok: false,
          json: async () => ({}),
        }
      })

      const lifi = new LiFi({
        chainId,
        userAddress,
      })

      await lifi
        .getReverseQuote({
          fromToken: sDAI,
          toToken: USDC,
          amount,
          meta,
          maxSlippage,
        })
        .catch(() => {}) // ignore error

      expect(calledUrl).toBeDefined()
      expect(calledUrl?.toString()).toBe('https://li.quest/v1/quote/contractCalls')
      expect(calledOptions).toBeDefined()
      expect(calledOptions?.method).toBe('POST')
      expect(calledOptions?.body).toBeDefined()
      expect(JSON.parse(calledOptions!.body as any)).toEqual({
        fromChain: chainId.toString(),
        toChain: chainId.toString(),
        fromAddress: userAddress,
        fromToken: sDAI,
        toToken: USDC,
        toAmount: amount.toString(),
        maxSlippage: maxSlippageAsString,
        contractCalls: [],
      })
    })

    test('throws error if fetch fails', async () => {
      vi.stubGlobal('fetch', async () => {
        return {
          ok: false,
          json: async () => ({}),
        }
      })

      const lifi = new LiFi({
        chainId,
        userAddress,
      })

      await expect(
        lifi.getReverseQuote({
          fromToken: sDAI,
          toToken: USDC,
          amount,
          meta,
          maxSlippage,
        }),
      ).rejects.toThrow()
    })

    test('parses response', async () => {
      vi.stubGlobal('fetch', async () => {
        return {
          ok: true,
          json: async () => rawResponse,
        }
      })

      const lifi = new LiFi({
        chainId,
        userAddress,
      })

      const response = await lifi.getReverseQuote({
        fromToken: sDAI,
        toToken: USDC,
        amount,
        meta,
        maxSlippage,
      })

      expect(response).toEqual({
        transactionRequest: {
          data: rawResponse.transactionRequest.data,
          from: userAddress,
          to: rawResponse.transactionRequest.to,
          value: BigInt(rawResponse.transactionRequest.value),
          gasPrice: BigInt(rawResponse.transactionRequest.gasPrice),
          gasLimit: BigInt(rawResponse.transactionRequest.gasLimit),
        },
        estimate: {
          feeCosts: [{ amountUSD: 1 }],
          fromAmount: 1000000000000000000n,
          toAmount: 943000000000000000n,
        },
        action: {
          fromToken: { address: USDC },
          toToken: { address: sDAI },
        },
      })
    })

    test('throws error if response is not valid', async () => {
      const transactionRequest = {
        data: '0x', // empty data
        from: userAddress,
        to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
        value: '0x0',
        gasPrice: '0xe1a0aa5f1',
        gasLimit: '0x75d63',
        chainId: 1,
      }

      vi.stubGlobal('fetch', async () => {
        return {
          ok: true,
          json: async () => ({
            transactionRequest,
          }),
        }
      })

      const lifi = new LiFi({
        chainId,
        userAddress,
      })

      await expect(
        lifi.getReverseQuote({
          fromToken: sDAI,
          toToken: USDC,
          amount,
          meta,
          maxSlippage,
        }),
      ).rejects.toThrow()
    })
  })
})
