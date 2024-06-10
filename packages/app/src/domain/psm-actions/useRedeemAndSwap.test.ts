import { psmActionsAbi } from '@/config/abis/psmActionsAbi'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { erc4626Abi } from 'viem'
import { mainnet } from 'viem/chains'
import { UseRedeemAndSwap } from './useRedeemAndSwap'

const account = testAddresses.alice
const sharesAmount = BaseUnitNumber(1)
const savingsToken = testAddresses.token2
const psmActions = testAddresses.token
const gemMinAmountOut = BaseUnitNumber(1)

const hookRenderer = setupHookRenderer({
  hook: UseRedeemAndSwap,
  account,
  handlers: [
    handlers.chainIdCall({ chainId: mainnet.id }),
    handlers.balanceCall({ balance: 0n, address: account }),
    handlers.contractCall({
      to: psmActions,
      abi: psmActionsAbi,
      functionName: 'savingsToken',
      result: savingsToken,
    }),
    handlers.contractCall({
      to: savingsToken,
      abi: erc4626Abi,
      functionName: 'convertToAssets',
      args: [toBigInt(sharesAmount)],
      result: toBigInt(gemMinAmountOut),
    }),
  ],
  args: {
    sharesAmount,
    psmActions,
  },
})

describe(UseRedeemAndSwap.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled for 0 gem value', async () => {
    const { result } = hookRenderer({ args: { sharesAmount: BaseUnitNumber(0), psmActions } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { enabled: false, sharesAmount, psmActions } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('redeems using psm actions', async () => {
    const { result } = hookRenderer({
      args: {
        sharesAmount,
        psmActions,
      },
      extraHandlers: [
        handlers.contractCall({
          to: psmActions,
          abi: psmActionsAbi,
          functionName: 'redeemAndSwap',
          args: [account, toBigInt(sharesAmount), toBigInt(gemMinAmountOut)],
          from: account,
          result: 1n,
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
