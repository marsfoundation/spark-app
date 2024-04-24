import { waitFor } from '@testing-library/react'
import { erc20Abi } from 'viem'
import { mainnet } from 'viem/chains'

import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { getTestTrigger } from '@/test/integration/trigger'

import { useWrite } from './useWrite'

describe(useWrite.name, () => {
  it('simulates the transaction', async () => {
    const { trigger, release } = getTestTrigger()
    const { result } = hookRenderer({ handlers: [balanceCall, handlers.triggerHandler(simulateCallHandler, trigger)] })

    await waitFor(() => expect(result.current.status.kind).toBe('simulating'))

    release()

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))
  })

  it('sends the transaction and waits for it to be mined', async () => {
    const { result } = hookRenderer({ extraHandlers: [handlers.mineTransaction()] })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))

    result.current.write()

    await waitFor(() => expect(result.current.status.kind).toBe('success'))
  })

  it('propagates simulation errors', async () => {
    const expectedError = 'forced error'
    const { result } = hookRenderer({
      handlers: [balanceCall, handlers.forceCallErrorHandler(simulateCallHandler, expectedError)],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('error'))
    expect((result.current.status as any).errorKind).toBe('simulation')
    expect((result.current.status as any).error.shortMessage).toBe(
      `The contract function "transfer" reverted with the following reason:\n${expectedError}`,
    )
  })

  it('propagates tx-submission errors', async () => {
    const { result } = hookRenderer({
      handlers: [chainIdCall, balanceCall, simulateCallHandler, handlers.rejectSubmittedTransaction()],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))

    result.current.write()

    await waitFor(() => expect(result.current.status.kind).toBe('error'), { timeout: 5000 }) // it takes more time because of retries
    expect((result.current.status as any).errorKind).toBe('tx-submission')
    expect((result.current.status as any).error.shortMessage).toBe('An unknown RPC error occurred.') // @todo this is due to rejectSubmittedTransaction not being perfect
  })

  it('propagates tx-reverted errors', async () => {
    const { result } = hookRenderer({
      handlers: [chainIdCall, balanceCall, simulateCallHandler, handlers.mineRevertedTransaction()],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))

    result.current.write()

    await waitFor(() => expect(result.current.status.kind).toBe('error'))
    expect((result.current.status as any).errorKind).toBe('tx-reverted')
    expect((result.current.status as any).error.shortMessage).toBe('An unknown RPC error occurred.') // @todo this is due to mineRejectedTransaction not being perfect
  })

  it('resets the write state when the args change', async () => {
    // for some reason this test doesn't work and is stuck in the "disabled" state (write function is not recreated properly by wagmi)
    const { result, rerender } = hookRenderer({
      extraHandlers: [
        handlers.mineTransaction(),

        handlers.contractCall({
          to: testAddresses.token,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [testAddresses.bob, 200n],
          from: testAddresses.alice,
          result: true,
        }),
      ],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))

    result.current.write()

    await waitFor(() => expect(result.current.status.kind).toBe('success'))

    rerender({
      args: {
        ...defaultArgs,
        args: [testAddresses.bob, 200n], // bump value to trigger reset
      } as any,
    })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))
  })

  it('does not propagate simulation errors if disabled', async () => {
    const expectedError = 'forced error'
    const { result, rerender } = hookRenderer({
      handlers: [balanceCall, handlers.forceCallErrorHandler(simulateCallHandler, expectedError)],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('error'))
    rerender({ args: { ...defaultArgs } as any, enabled: false })
    await waitFor(() => expect(result.current.status.kind).toBe('disabled'))
    await waitFor(() => expect((result.current as any).error).toBe(undefined))
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
  address: testAddresses.token,
  abi: erc20Abi,
  functionName: 'transfer',
  args: [testAddresses.bob, 100n],
} as const

const hookRenderer = setupHookRenderer({
  hook: useWrite,
  account: testAddresses.alice,
  handlers: [chainIdCall, balanceCall, simulateCallHandler],
  args: defaultArgs,
})
