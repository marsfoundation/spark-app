import { waitFor } from '@testing-library/react'
import { erc20Abi } from 'viem'

import { MAX_INT, NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'

import { useAllowance } from './useAllowance'

const mockedAllowance = 2137n
const token = testAddresses.token
const account = testAddresses.alice
const spender = testAddresses.bob

const hookRenderer = setupHookRenderer({
  hook: useAllowance,
  account,
  handlers: [handlers.balanceCall({ balance: 0n, address: account })],
  args: { token, spender },
})

describe(useAllowance.name, () => {
  it('returns max allowance for native asset', async () => {
    const { result } = hookRenderer({
      args: { token: NATIVE_ASSET_MOCK_ADDRESS, spender },
    })

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toBe(MAX_INT)
  })

  it('returns proper allowance from chain', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [account, spender],
          result: mockedAllowance,
        }),
      ],
    })

    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data).toBe(mockedAllowance)
  })

  it('propagates errors', async () => {
    const expectedError = 'Not allowed!'
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCallError({
          to: token,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [account, spender],
          errorMessage: expectedError,
        }),
      ],
    })

    await waitFor(() => expect(result.current.error).not.toBe(null))
    expect((result.current.error as any).shortMessage).toBe(
      `The contract function "allowance" reverted with the following reason:\n${expectedError}`,
    )
  })
})
