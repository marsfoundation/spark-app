import { waitFor } from '@testing-library/react'
import { encodeFunctionData, erc20Abi } from 'viem'
import { mainnet } from 'viem/chains'
import { describe, expect, test, vi } from 'vitest'

import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'

import { TxRequest } from '../exchanges/types'
import { BaseUnitNumber, NormalizedUnitNumber } from '../types/NumericValues'
import { useExchange } from './useExchange'

const account = testAddresses.alice
const fromToken = testAddresses.token
const toToken = testAddresses.token2
const amount = BaseUnitNumber(10_000_000_000)
const chainId = mainnet.id

const dataArgs = {
  abi: erc20Abi,
  functionName: 'transfer',
  args: [testAddresses.bob, toBigInt(amount)],
} as const

const transactionRequest: TxRequest = {
  data: encodeFunctionData(dataArgs), // mock calldata
  from: account,
  to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
  value: 0n,
  gasPrice: 0xe1a0aa5f1n,
  gasLimit: 0x75d63n,
}

const hookRenderer = setupHookRenderer({
  hook: useExchange,
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    swapInfo: {
      status: 'success',
      data: {
        fromToken,
        toToken,
        txRequest: transactionRequest,
        estimate: {
          feeCostsUSD: NormalizedUnitNumber(0),
          fromAmount: amount,
          toAmount: BaseUnitNumber('943000000000000000'),
          toAmountMin: BaseUnitNumber('943000000000000000'),
        },
        type: 'direct',
      },
    },
  },
})

describe(useExchange.name, () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('sends correct transaction', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          ...dataArgs,
          to: transactionRequest.to,
          from: account,
          value: 0n,
          result: true,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('ready')
    })

    result.current.send()

    await waitFor(() => {
      expect(result.current.status.kind).toBe('success')
    })
  })
})
