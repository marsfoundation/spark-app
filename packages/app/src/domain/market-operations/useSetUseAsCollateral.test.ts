import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'

import { poolAbi } from '@/config/abis/poolAbi'
import { lendingPoolAddress } from '@/config/contracts-generated'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'

import { useSetUseAsCollateral } from './useSetUseAsCollateral'

const asset = testAddresses.token
const account = testAddresses.alice

const initialArgs = {
  asset,
  useAsCollateral: true,
}

const hookRenderer = setupHookRenderer({
  hook: useSetUseAsCollateral,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id })],
  args: initialArgs,
})

describe(useSetUseAsCollateral.name, () => {
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

  it('enables asset as collateral', async () => {
    const { result } = hookRenderer({
      args: {
        ...initialArgs,
      },
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[mainnet.id],
          abi: poolAbi,
          functionName: 'setUserUseReserveAsCollateral',
          args: [asset, true],
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

  it('disables asset as collateral', async () => {
    const { result } = hookRenderer({
      args: {
        ...initialArgs,
        useAsCollateral: false,
      },
      extraHandlers: [
        handlers.contractCall({
          to: lendingPoolAddress[mainnet.id],
          abi: poolAbi,
          functionName: 'setUserUseReserveAsCollateral',
          args: [asset, false],
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
