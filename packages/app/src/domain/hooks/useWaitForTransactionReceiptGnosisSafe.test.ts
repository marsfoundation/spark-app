import { testAddresses } from '@/test/integration/constants'
import { expectToStayUndefined } from '@/test/integration/expect'
import { createBlockNumberCallHandler, createGetLogsHandler, handlers } from '@/test/integration/mockTransport/handlers'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { waitFor } from '@testing-library/react'
import { parseAbiItem } from 'viem'
import { describe, test } from 'vitest'
import { useWaitForTransactionReceiptGnosisSafe } from './useWaitForTransactionReceiptGnosisSafe'

const hookRenderer = setupHookRenderer({
  hook: useWaitForTransactionReceiptGnosisSafe,
  account: testAddresses.alice,
  handlers: [],
  args: undefined,
})

describe(useWaitForTransactionReceiptGnosisSafe.name, () => {
  test('waits until event is emitted', async () => {
    const gnosisTxHash = '0xb1ec3f7f1b1d8d6b5b1f6e7a8c9c7d8e7f1b8e7c1b8f7a8e7f1b8e7a8f1b8e7c'
    const subTxHash = '0x8e8c3f7f1b1d8d6b5b1f6e7a8c9c7d8e7f1b8e7c1b8f7a8e7f1b8e7a8f1b8e7c'
    const initialBlockNumber = 1000n

    const { handler: blockNumberHandler, incrementBlockNumber } = createBlockNumberCallHandler(initialBlockNumber)
    const { handler: logsHandler, setEnabled: setLogsHandlerEnabled } = createGetLogsHandler({
      address: testAddresses.alice,
      event: parseAbiItem('event ExecutionSuccess(bytes32 txHash, uint256 payment)'),
      args: {
        txHash: gnosisTxHash,
        payment: 0n,
      },
      blockNumber: initialBlockNumber + 2n,
      transactionHash: gnosisTxHash,
    })

    const { result } = hookRenderer({
      handlers: [
        blockNumberHandler,
        logsHandler,
        handlers.mineTransaction({
          txHash: gnosisTxHash,
        }),
      ],
      args: {
        hash: subTxHash,
      },
    })

    await waitFor(() => expect(result.current).not.toBeNull())

    expect(result.current.txHash).toBe(undefined)

    expectToStayUndefined(() => result.current.data)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.status).toBe('pending')

    incrementBlockNumber()
    expectToStayUndefined(() => result.current.data)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.status).toBe('pending')

    setLogsHandlerEnabled(true)
    expectToStayUndefined(() => result.current.data)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.status).toBe('pending')

    incrementBlockNumber()
    await waitFor(() => expect(result.current.data).toBeDefined())
  })
})
