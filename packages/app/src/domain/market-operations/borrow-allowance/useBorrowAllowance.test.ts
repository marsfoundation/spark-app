import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'

import { debtTokenAbi } from '@/config/abis/debtTokenAbi'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'

import { useBorrowAllowance } from './useBorrowAllowance'

const mockedBorrowAllowance = 2137n
const account = testAddresses.alice
const wethGateway = testAddresses.token
const debtToken = testAddresses.token2

const hookRenderer = setupHookRenderer({
  hook: useBorrowAllowance,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id })],
  args: { fromUser: account, toUser: wethGateway, debtTokenAddress: debtToken },
})

describe(useBorrowAllowance.name, () => {
  test('returns proper allowance from chain', async () => {
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
    expect(result.current.data).toBe(mockedBorrowAllowance)
  })

  test('propagates errors', async () => {
    const expectedError = 'Not allowed!'
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCallError({
          to: debtToken,
          abi: debtTokenAbi,
          functionName: 'borrowAllowance',
          args: [account, wethGateway],
          errorMessage: expectedError,
        }),
      ],
    })

    await waitFor(() => expect(result.current.error).not.toBe(null))
    expect((result.current.error as any).shortMessage).toBe(
      `The contract function "borrowAllowance" reverted with the following reason:\n${expectedError}`,
    )
  })
})
