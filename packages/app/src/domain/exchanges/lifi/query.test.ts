import { mainnet } from 'viem/chains'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { BaseUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { queryClient } from '@/test/integration/query-client'

import { LiFi } from './lifi'
import { RealLifiQueryMetaEvaluator } from './meta'
import { fetchLiFiTxData } from './query'

const dai = testAddresses.token
const sdai = testAddresses.token2
const usdc = testAddresses.token3
const userAddress = testAddresses.alice
const chainId = mainnet.id

let mockFetch = vi.fn()

describe(fetchLiFiTxData.name, () => {
  const queryMetaEvaluator = new RealLifiQueryMetaEvaluator({ dai, sdai, usdc })
  const lifiClient = new LiFi({ chainId, userAddress })

  beforeEach(() => {
    mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('direct', () => {
    test('waives fee for dai to sdai conversion', async () => {
      const amount = BaseUnitNumber(1)
      const maxSlippage = Percentage(0.005)

      await queryClient
        .fetchQuery(
          fetchLiFiTxData({
            client: lifiClient,
            fromToken: dai,
            toToken: sdai,
            maxSlippage,
            amount,
            type: 'direct',
            queryMetaEvaluator,
          }),
        )
        .catch(() => {}) // ignore errors

      expect(mockFetch).toHaveBeenCalledWithURLParams({
        integrator: 'spark_waivefee',
        fee: '0',
        fromToken: dai,
        toToken: sdai,
      })
    })
  })
})

expect.extend({
  toHaveBeenCalledWithURLParams(mockFetch, expected) {
    const lastCall = mockFetch?.mock?.lastCall
    if (!Array.isArray(lastCall)) {
      return {
        pass: false,
        message: () => 'mock fetch was not called',
      }
    }
    if (typeof lastCall[0] !== 'string') {
      return {
        pass: false,
        message: () => `fetch was called with ${typeof lastCall[0]}, expected URL`,
      }
    }

    const url = new URL(lastCall[0])
    for (const [key, value] of Object.entries(expected)) {
      if (url.searchParams.get(key) !== value) {
        return {
          pass: false,
          message: () => `fetch was called with ${key}=${url.searchParams.get(key)}, expected ${key}=${value}`,
        }
      }
      expect(url.searchParams.get(key), `Non-matching key: ${key}`).toStrictEqual(value)
    }

    return {
      pass: true,
      message: () => '',
    }
  },
})
