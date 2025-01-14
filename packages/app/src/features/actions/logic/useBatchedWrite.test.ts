import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { waitFor } from '@testing-library/react'
import { erc20Abi } from 'viem'
import { mainnet } from 'viem/chains'
import { vi } from 'vitest'
import { useBatchedWrite } from './useBatchedWrite'

describe(useBatchedWrite.name, () => {
  it('sends multiple transactions and waits for them to be confirmed', async () => {
    const { result } = hookRenderer({ extraHandlers: [handlers.mineBatchedTransaction()] })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))
    result.current.write()
    await waitFor(() => expect(result.current.status.kind).toBe('success'))
  })

  it('propagates wallet send calls errors', async () => {
    const { result } = hookRenderer({
      extraHandlers: [handlers.rejectSubmittedBatchedTransaction()],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))
    result.current.write()
    await waitFor(() => expect(result.current.status.kind).toBe('error'))
    expect((result.current.status as any).errorKind).toBe('calls-submission')
  })

  it('propagates wallet calls status errors', async () => {
    const { result } = hookRenderer({
      extraHandlers: [handlers.rejectSubmittedBatchedTransactionStatusCheck()],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))
    result.current.write()
    await waitFor(() => expect(result.current.status.kind).toBe('error'))
    expect((result.current.status as any).errorKind).toBe('calls-confirmation')
  })

  it('propagates error when one of transactions from batch fails', async () => {
    const { result } = hookRenderer({
      extraHandlers: [handlers.rejectTransactionFromBatch()],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))
    result.current.write()
    await waitFor(() => expect(result.current.status.kind).toBe('error'))
    expect((result.current.status as any).errorKind).toBe('calls-member-tx-reverted')
  })

  it('handles disabled state', async () => {
    const { result, rerender } = hookRenderer({
      args: { contracts, enabled: false },
      extraHandlers: [handlers.mineBatchedTransaction()],
    })

    await waitFor(() => expect(result.current.status.kind).toBe('disabled'))
    rerender({ contracts, enabled: true })
    await waitFor(() => expect(result.current.status.kind).toBe('ready'))
  })

  it('calls onTransactionSettled callback when transactions are confirmed', async () => {
    const onTransactionSettled = vi.fn()
    const { result } = hookRenderer({
      extraHandlers: [handlers.mineBatchedTransaction()],
      args: { contracts, callbacks: { onTransactionSettled } },
    })

    await waitFor(() => expect(result.current.status.kind).toBe('ready'))
    result.current.write()
    await waitFor(() => expect(result.current.status.kind).toBe('success'))
    expect(onTransactionSettled).toHaveBeenCalled()
  })
})

const chainIdCall = handlers.chainIdCall({ chainId: mainnet.id })

const contracts = [
  {
    address: testAddresses.token,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [testAddresses.bob, 100n],
  },
  {
    address: testAddresses.token2,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [testAddresses.bob, 200n],
  },
]

const hookRenderer = setupHookRenderer({
  hook: useBatchedWrite,
  account: testAddresses.alice,
  handlers: [chainIdCall],
  args: { contracts },
})
