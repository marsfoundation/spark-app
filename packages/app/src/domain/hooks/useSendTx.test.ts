import { waitFor } from '@testing-library/react'
import { encodeFunctionData, erc20Abi } from 'viem'
import { mainnet } from 'viem/chains'

import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { getTestTrigger } from '@/test/integration/trigger'

import { useSendTx } from './useSendTx'

describe(useSendTx.name, () => {
  test('simulates the transaction', async () => {
    const { trigger, release } = getTestTrigger()
    const { result } = hookRenderer({ handlers: [balanceCall, handlers.triggerHandler(simulateCallHandler, trigger)] })

    await waitFor(() => expect(result.current.status.kind).toBe('simulating'))

    release()

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))
  })

  test('sends the transaction and waits for it to be mined', async () => {
    const { result } = hookRenderer({ extraHandlers: [handlers.mineTransaction()] })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))

    result.current.send()

    await waitFor(() => expect(result.current.status.kind).toBe('success'))
  })

  test('propagates simulation errors', async () => {
    const expectedError = 'forced error'
    const { result } = hookRenderer({
      handlers: [balanceCall, handlers.forceCallErrorHandler(simulateCallHandler, expectedError)],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('error'))
    expect((result.current.status as any).errorKind).toBe('simulation')
    expect((result.current.status as any).error).toBeInstanceOf(Error)
  })

  test('propagates tx-submission errors', async () => {
    const { result } = hookRenderer({
      handlers: [chainIdCall, balanceCall, simulateCallHandler, handlers.rejectSubmittedTransaction()],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))

    result.current.send()

    await waitFor(() => expect(result.current.status.kind).toBe('error')) // it takes more time because of retries
    expect((result.current.status as any).errorKind).toBe('tx-submission')
    expect((result.current.status as any).error.shortMessage).toBe('An unknown RPC error occurred.') // @todo this is due to rejectSubmittedTransaction not being perfect
  })

  test('propagates tx-reverted errors', async () => {
    const { result } = hookRenderer({
      handlers: [chainIdCall, balanceCall, simulateCallHandler, handlers.mineRevertedTransaction()],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))

    result.current.send()

    await waitFor(() => expect(result.current.status.kind).toBe('error'))
    expect((result.current.status as any).errorKind).toBe('tx-reverted')
    expect((result.current.status as any).error.shortMessage).toBe('An unknown RPC error occurred.') // @todo this is due to mineRejectedTransaction not being perfect
  })

  test('does not propagate simulation errors if disabled', async () => {
    const expectedError = 'forced error'
    const { result, rerender } = hookRenderer({
      handlers: [balanceCall, handlers.forceCallErrorHandler(simulateCallHandler, expectedError)],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('error'))
    rerender({ data: '0x', enabled: false })
    await waitFor(() => expect(result.current.status.kind).toBe('disabled'))
    expect((result.current.status as any).error).toBe(undefined)
  })
})

const balanceCall = handlers.balanceCall({ balance: 0n, address: testAddresses.alice })
const chainIdCall = handlers.chainIdCall({ chainId: mainnet.id })

const simulateCallHandler = handlers.contractCall({
  to: testAddresses.token,
  abi: erc20Abi,
  functionName: 'transfer',
  args: [testAddresses.bob, 100n],
  from: testAddresses.alice,
  result: true,
})

const defaultArgs = {
  to: testAddresses.token,
  data: encodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
    args: [testAddresses.bob, 100n],
  }),
  from: testAddresses.alice,
} as const

const hookRenderer = setupHookRenderer({
  hook: useSendTx,
  account: testAddresses.alice,
  handlers: [chainIdCall, balanceCall, simulateCallHandler],
  args: defaultArgs,
})
