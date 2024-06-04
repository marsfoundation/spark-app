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
  test('waits until gnosis transaction is mined', async () => {
    const gnosisTxHash = '0x58f52e5a4a58653a43edb53e3a5ebf436fb698223029b46210d1b232aed02e08'
    const subTxHash = '0x3083360cd4dded67c00d98ae6fd4ef25a4adfb77eebfa4e6679e6e2f3000021a'
    const initialBlockNumber = 1000n

    const { handler: blockNumberHandler, incrementBlockNumber } = createBlockNumberCallHandler(initialBlockNumber)
    const { handler: logsHandler, setEnabled: setLogsHandlerEnabled } = createGetLogsHandler({
      address: testAddresses.alice,
      event: parseAbiItem('event ExecutionSuccess(bytes32 txHash, uint256 payment)'),
      args: {
        txHash: subTxHash,
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

    expect(result.current.data).toBe(undefined)

    await expectToStayUndefined(() => result.current.data)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.status).toBe('pending')

    incrementBlockNumber()
    await expectToStayUndefined(() => result.current.data)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.status).toBe('pending')

    setLogsHandlerEnabled(true)
    await expectToStayUndefined(() => result.current.data)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.status).toBe('pending')

    incrementBlockNumber()
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data?.transactionHash).toBe(gnosisTxHash)
  })

  test('returns transaction without waiting if mined immediately', async () => {
    const gnosisTxHash = '0x58f52e5a4a58653a43edb53e3a5ebf436fb698223029b46210d1b232aed02e08'
    const subTxHash = '0x3083360cd4dded67c00d98ae6fd4ef25a4adfb77eebfa4e6679e6e2f3000021a'
    const blockNumber = 1000n

    const { handler: logsHandler, setEnabled: setLogsHandlerEnabled } = createGetLogsHandler({
      address: testAddresses.alice,
      event: parseAbiItem('event ExecutionSuccess(bytes32 txHash, uint256 payment)'),
      args: {
        txHash: subTxHash,
        payment: 0n,
      },
      blockNumber: blockNumber,
      transactionHash: gnosisTxHash,
    })
    setLogsHandlerEnabled(true)

    const { result } = hookRenderer({
      handlers: [
        handlers.blockNumberCall(blockNumber),
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

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data?.transactionHash).toBe(gnosisTxHash)
  })

  test("returns error if can't fetch transaction", async () => {
    const gnosisTxHash = '0x58f52e5a4a58653a43edb53e3a5ebf436fb698223029b46210d1b232aed02e08'
    const subTxHash = '0x3083360cd4dded67c00d98ae6fd4ef25a4adfb77eebfa4e6679e6e2f3000021a'
    const blockNumber = 1000n

    const { handler: logsHandler, setEnabled: setLogsHandlerEnabled } = createGetLogsHandler({
      address: testAddresses.alice,
      event: parseAbiItem('event ExecutionSuccess(bytes32 txHash, uint256 payment)'),
      args: {
        txHash: subTxHash,
        payment: 0n,
      },
      blockNumber: blockNumber,
      transactionHash: gnosisTxHash,
    })
    setLogsHandlerEnabled(true)

    const { result } = hookRenderer({
      handlers: [handlers.blockNumberCall(blockNumber), logsHandler],
      args: {
        hash: subTxHash,
      },
    })

    await waitFor(() => expect(result.current).not.toBeNull())

    await waitFor(() => expect(result.current.error).toBeDefined())
    expect(result.current.data).toBeUndefined()
    expect(result.current.error?.name).toBe('UnknownRpcError')
  })

  test("returns error if can't fetch logs", async () => {
    const subTxHash = '0x3083360cd4dded67c00d98ae6fd4ef25a4adfb77eebfa4e6679e6e2f3000021a'
    const blockNumber = 1000n

    const { result } = hookRenderer({
      handlers: [handlers.blockNumberCall(blockNumber)],
      args: {
        hash: subTxHash,
      },
    })

    await waitFor(() => expect(result.current).not.toBeNull())

    await waitFor(() => expect(result.current.error).toBeDefined())
    expect(result.current.data).toBeUndefined()
    expect(result.current.error?.name).toBe('UnknownRpcError')
  })

  test("returns error if can't fetch new blocks", async () => {
    const subTxHash = '0x3083360cd4dded67c00d98ae6fd4ef25a4adfb77eebfa4e6679e6e2f3000021a'

    const { result } = hookRenderer({
      handlers: [],
      args: {
        hash: subTxHash,
      },
    })

    await waitFor(() => expect(result.current).not.toBeNull())

    await waitFor(() => expect(result.current.error).toBeDefined())
    expect(result.current.data).toBeUndefined()
    expect(result.current.error?.name).toBe('UnknownRpcError')
  })
})
