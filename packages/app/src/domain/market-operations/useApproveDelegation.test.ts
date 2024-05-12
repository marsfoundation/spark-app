import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'

import { debtTokenAbi } from '@/config/abis/debtTokenAbi'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'

import { toBigInt } from '../../utils/bigNumber'
import { BaseUnitNumber } from '../types/NumericValues'
import { useApproveDelegation } from './useApproveDelegation'

const defaultValue = BaseUnitNumber(100)
const debtTokenAddress = testAddresses.token
const account = testAddresses.alice
const delegatee = testAddresses.bob

const hookRenderer = setupHookRenderer({
  hook: useApproveDelegation,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id })],
  args: { debtTokenAddress, delegatee, value: defaultValue },
})

describe(useApproveDelegation.name, () => {
  test('is not enabled if wrong value', async () => {
    const { result } = hookRenderer({ args: { value: BaseUnitNumber(0), delegatee, debtTokenAddress } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('respects enabled flag', async () => {
    const { result } = hookRenderer({
      args: { enabled: false, value: defaultValue, delegatee, debtTokenAddress },
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('approves delegation', async () => {
    const { result } = hookRenderer({
      args: { value: defaultValue, delegatee, debtTokenAddress },
      extraHandlers: [
        handlers.contractCall({
          to: debtTokenAddress,
          abi: debtTokenAbi,
          functionName: 'approveDelegation',
          args: [delegatee, toBigInt(defaultValue)],
          from: account,
          result: undefined,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('ready')
    })

    result.current.write()

    await waitFor(() => {
      expect(result.current.status.kind).toBe('success')
    })
  })
})
