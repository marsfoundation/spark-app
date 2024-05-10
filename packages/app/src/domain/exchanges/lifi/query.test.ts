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

  test('waives fee for sdai to dai conversion', async () => {
    const amount = BaseUnitNumber(1)
    const maxSlippage = Percentage(0.005)

    await queryClient
      .fetchQuery(
        fetchLiFiTxData({
          client: lifiClient,
          fromToken: sdai,
          toToken: dai,
          maxSlippage,
          amount,
          type: 'reverse',
          queryMetaEvaluator,
        }),
      )
      .catch(() => {}) // ignore errors

    expect(mockFetch).toHaveBeenCalledWithBodyParams({
      integrator: 'spark_waivefee',
      fee: '0',
      fromToken: sdai,
      toToken: dai,
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

    const url = new URL(lastCall[0] as any)
    for (const [key, value] of Object.entries(expected)) {
      if (url.searchParams.get(key) !== value) {
        return {
          pass: false,
          message: () => `fetch was called with ${key}=${url.searchParams.get(key)}, expected ${key}=${value}`,
        }
      }
    }

    return {
      pass: true,
      message: () => '',
    }
  },
  toHaveBeenCalledWithBodyParams(mockFetch, expected) {
    const lastCall = mockFetch?.mock?.lastCall
    if (!Array.isArray(lastCall)) {
      return {
        pass: false,
        message: () => 'mock fetch was not called',
      }
    }
    if (typeof (lastCall[1] as any)?.body !== 'string') {
      return {
        pass: false,
        message: () => 'mock fetch was not called with a body',
      }
    }
    const body = JSON.parse((lastCall[1] as any)?.body) as any
    for (const [key, value] of Object.entries(expected)) {
      if (body[key] !== value) {
        return {
          pass: false,
          message: () => `fetch was called with ${key}=${body[key]}, expected ${key}=${value}`,
        }
      }
    }

    return {
      pass: true,
      message: () => '',
    }
  },
})
