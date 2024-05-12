import { mainnet } from 'viem/chains'
import { afterEach, describe, expect, test, beforeEach, mock } from 'bun:test'

import { BaseUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { queryClient } from '@/test/integration/query-client'

import { LiFi } from './lifi'
import { RealLifiQueryMetaEvaluator } from './meta'
import { fetchLiFiTxData } from './query'
import { vi } from '@/test/integration/vi-adapter'

const dai = testAddresses.token
const sdai = testAddresses.token2
const usdc = testAddresses.token3
const usdt = testAddresses.token4
const userAddress = testAddresses.alice
const chainId = mainnet.id

let mockFetch = mock()

async function triggerLiFiCall(...args: Parameters<typeof fetchLiFiTxData>): Promise<void> {
  await queryClient.fetchQuery(fetchLiFiTxData(...args)).catch(() => {}) // ignore errors
}

describe(fetchLiFiTxData.name, () => {
  const queryMetaEvaluator = new RealLifiQueryMetaEvaluator({ dai, sdai, usdc })
  const lifiClient = new LiFi({ chainId, userAddress })

  beforeEach(() => {
    mockFetch = mock()
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
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: userAddress,
      fromAmount: amount.toString(),
      slippage: maxSlippage.toString(),
      integrator: 'spark_waivefee',
      fee: '0',
      fromToken: dai,
      toToken: sdai,
    })
  })

  test('waives fee for USDC to sDAI conversion', async () => {
    const amount = BaseUnitNumber(2)
    const maxSlippage = Percentage(0.006)

    await triggerLiFiCall({
      client: lifiClient,
      fromToken: usdc,
      toToken: sdai,
      maxSlippage,
      amount,
      type: 'direct',
      queryMetaEvaluator,
    })

    expect(mockFetch).toHaveBeenCalledWithURL('https://li.quest/v1/quote')
    expect(mockFetch).toHaveBeenCalledWithURLParams({
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: userAddress,
      fromAmount: amount.toString(),
      slippage: maxSlippage.toString(),
      integrator: 'spark_waivefee',
      fee: '0',
      fromToken: usdc,
      toToken: sdai,
    })
  })

  test("doesn't waive fee for USDT to sDAI conversion", async () => {
    const amount = BaseUnitNumber(3)
    const maxSlippage = Percentage(0.007)

    await triggerLiFiCall({
      client: lifiClient,
      fromToken: usdt,
      toToken: sdai,
      maxSlippage,
      amount,
      type: 'direct',
      queryMetaEvaluator,
    })

    expect(mockFetch).toHaveBeenCalledWithURL('https://li.quest/v1/quote')
    expect(mockFetch).toHaveBeenCalledWithURLParams({
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: userAddress,
      fromAmount: amount.toString(),
      slippage: maxSlippage.toString(),
      integrator: 'spark_fee',
      fee: '0.002',
      fromToken: usdt,
      toToken: sdai,
    })
  })

  test('waives fee for sDAI to DAI conversion', async () => {
    const amount = BaseUnitNumber(4)
    const maxSlippage = Percentage(0.008)

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
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: userAddress,
      toAmount: amount.toString(),
      slippage: maxSlippage.toString(),
      integrator: 'spark_waivefee',
      fee: '0',
      fromToken: sdai,
      toToken: dai,
    })
  })

  test('waives fee for sDAI to USDC conversion', async () => {
    const amount = BaseUnitNumber(5)
    const maxSlippage = Percentage(0.009)

    await triggerLiFiCall({
      client: lifiClient,
      fromToken: sdai,
      toToken: usdc,
      maxSlippage,
      amount,
      type: 'reverse',
      queryMetaEvaluator,
    })

    expect(mockFetch).toHaveBeenCalledWithURL('https://li.quest/v1/quote/contractCalls')
    expect(mockFetch).toHaveBeenCalledWithBodyParams({
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: userAddress,
      toAmount: amount.toString(),
      slippage: maxSlippage.toString(),
      integrator: 'spark_waivefee',
      fee: '0',
      fromToken: sdai,
      toToken: usdc,
    })
  })

  test("doesn't waive fee for sDAI to USDT conversion", async () => {
    const amount = BaseUnitNumber(6)
    const maxSlippage = Percentage(0.01)

    await triggerLiFiCall({
      client: lifiClient,
      fromToken: sdai,
      toToken: usdt,
      maxSlippage,
      amount,
      type: 'reverse',
      queryMetaEvaluator,
    })

    expect(mockFetch).toHaveBeenCalledWithURL('https://li.quest/v1/quote/contractCalls')
    expect(mockFetch).toHaveBeenCalledWithBodyParams({
      fromChain: chainId.toString(),
      toChain: chainId.toString(),
      fromAddress: userAddress,
      toAmount: amount.toString(),
      slippage: maxSlippage.toString(),
      integrator: 'spark_fee',
      fee: '0.002',
      fromToken: sdai,
      toToken: usdt,
    })
  })
})
