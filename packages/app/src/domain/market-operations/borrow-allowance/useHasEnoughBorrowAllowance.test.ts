import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'

import { debtTokenAbi } from '@/config/abis/debtTokenAbi'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'

import { useHasEnoughBorrowAllowance } from './useHasEnoughBorrowAllowance'

const mockedBorrowAllowance = 2n
const account = testAddresses.alice
const wethGateway = testAddresses.token
const debtToken = testAddresses.token2

const hookRenderer = setupHookRenderer({
  hook: useHasEnoughBorrowAllowance,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id })],
  args: { toUser: wethGateway, debtTokenAddress: debtToken, value: BaseUnitNumber(mockedBorrowAllowance - 1n) },
})

describe(useHasEnoughBorrowAllowance.name, () => {
  test('returns true if borrow allowance is greater than value', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: debtToken,
          abi: debtTokenAbi,
          functionName: 'borrowAllowance',
          args: [account, wethGateway],
          result: mockedBorrowAllowance,
        }),
      ],
    })

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toBe(true)
  })

  test('returns true if borrow allowance is equal to value', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: debtToken,
          abi: debtTokenAbi,
          functionName: 'borrowAllowance',
          args: [account, wethGateway],
          result: mockedBorrowAllowance,
        }),
      ],
      args: { toUser: wethGateway, debtTokenAddress: debtToken, value: BaseUnitNumber(mockedBorrowAllowance) },
    })

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toBe(true)
  })

  test('returns false if borrow allowance is less than value', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: debtToken,
          abi: debtTokenAbi,
          functionName: 'borrowAllowance',
          args: [account, wethGateway],
          result: mockedBorrowAllowance,
        }),
      ],
      args: { toUser: wethGateway, debtTokenAddress: debtToken, value: BaseUnitNumber(mockedBorrowAllowance + 1n) },
    })

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toBe(false)
  })
})
