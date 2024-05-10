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

async function triggerLiFiCall(...args: Parameters<typeof fetchLiFiTxData>): Promise<void> {
  await queryClient.fetchQuery(fetchLiFiTxData(...args)).catch(() => {}) // ignore errors
}

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

  test('waives fee for DAI to sDAI conversion', async () => {
    const amount = BaseUnitNumber(1)
    const maxSlippage = Percentage(0.005)

    await triggerLiFiCall({
      client: lifiClient,
      fromToken: dai,
      toToken: sdai,
      maxSlippage,
      amount,
      type: 'direct',
      queryMetaEvaluator,
    })

    expect(mockFetch).toHaveBeenCalledWithURL('https://li.quest/v1/quote')
    expect(mockFetch).toHaveBeenCalledWithURLParams({
      integrator: 'spark_waivefee',
      fee: '0',
      fromToken: dai,
      toToken: sdai,
    })
  })

  test('waives fee for sDAI to DAI conversion', async () => {
    const amount = BaseUnitNumber(1)
    const maxSlippage = Percentage(0.005)

    await triggerLiFiCall({
      client: lifiClient,
      fromToken: sdai,
      toToken: dai,
      maxSlippage,
      amount,
      type: 'reverse',
      queryMetaEvaluator,
    })

    expect(mockFetch).toHaveBeenCalledWithURL('https://li.quest/v1/quote/contractCalls')
    expect(mockFetch).toHaveBeenCalledWithBodyParams({
      integrator: 'spark_waivefee',
      fee: '0',
      fromToken: sdai,
      toToken: dai,
    })
  })
})
