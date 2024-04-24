import { waitFor } from '@testing-library/react'
import { erc20Abi } from 'viem'
import { mainnet } from 'viem/chains'

import { NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'

import { toBigInt } from '../../utils/bigNumber'
import { BaseUnitNumber } from '../types/NumericValues'
import { useApprove } from './useApprove'

const defaultValue = BaseUnitNumber(100)
const token = testAddresses.token
const account = testAddresses.alice
const spender = testAddresses.bob

const hookRenderer = setupHookRenderer({
  hook: useApprove,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { token, spender, value: defaultValue },
})

describe(useApprove.name, () => {
  it('is not enabled if wrong value', async () => {
    const { result } = hookRenderer({ args: { value: BaseUnitNumber(0), token, spender } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled if address is a native asset', async () => {
    const { result } = hookRenderer({
      args: { value: defaultValue, token: NATIVE_ASSET_MOCK_ADDRESS, spender },
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('respects enabled flag', async () => {
    const { result } = hookRenderer({
      args: { enabled: false, value: defaultValue, token, spender },
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('approves', async () => {
    const { result } = hookRenderer({
      args: { value: defaultValue, token, spender },
      extraHandlers: [
        handlers.contractCall({
          to: token,
          abi: erc20Abi,
          functionName: 'approve',
          args: [spender, toBigInt(defaultValue)],
          result: true,
          from: account,
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
