import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'

import { poolAbi } from '@/config/abis/poolAbi'
import { lendingPoolAddress } from '@/config/contracts-generated'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'

import { useSetUserEMode } from './useSetUserEMode'

const account = testAddresses.alice

const initialArgs = {
  categoryId: 0,
}

const hookRenderer = setupHookRenderer({
  hook: useSetUserEMode,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id })],
  args: initialArgs,
})

describe(useSetUserEMode.name, () => {
  it('is not enabled for guest', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { ...initialArgs, enabled: false } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('changes eMode category', async () => {
    const { result } = hookRenderer({
      args: {
        categoryId: 1,
      },
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[mainnet.id],
          abi: poolAbi,
          functionName: 'setUserEMode',
          args: [1],
          from: account,
          result: undefined,
        }),
        handlers.mineTransaction(),
      ],
    })
    await waitFor(() => {
      expect(result.current.status.kind).toBe('ready')
    })
    expect((result.current as any).error).toBeUndefined()

    result.current.write()

    await waitFor(() => {
      expect(result.current.status.kind).toBe('success')
    })
  })
})
