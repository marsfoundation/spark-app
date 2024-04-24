import { waitFor } from '@testing-library/react'
import { erc20Abi } from 'viem'

import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { expectToStayUndefined } from '@/test/integration/expect'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { sleep } from '@/utils/promises'

import { useHasEnoughAllowance } from './useHasEnoughAllowance'

const mockedAllowance = BaseUnitNumber(2)
const token = testAddresses.token
const account = testAddresses.alice
const spender = testAddresses.bob

const hookRenderer = setupHookRenderer({
  hook: useHasEnoughAllowance,
  account,
  handlers: [],
  args: { token, spender, value: BaseUnitNumber(1) },
})

describe(useHasEnoughAllowance.name, () => {
  it('returns undefined if no data', async () => {
    const { result } = hookRenderer({ extraHandlers: [() => sleep(2000)] })

    await expectToStayUndefined(() => result.current.data)
    expect(result.current.error).toBeNull()
  })

  it('properly returns based on allowance', async () => {
    const args = { token, spender, value: BaseUnitNumber(mockedAllowance.plus(1)) }
    const { result, rerender } = hookRenderer({
      args,
      handlers: [
        handlers.balanceCall({ balance: 0n, address: account }),
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [account, spender],
          result: toBigInt(mockedAllowance),
        }),
      ],
    })

    await waitFor(() => expect(result.current.data).toBe(false))

    rerender({ ...args, value: mockedAllowance })

    await waitFor(() => expect(result.current.data).toBe(true))
  })
})
