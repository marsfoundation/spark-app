import { savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { daiLikeReserve, testAddresses, wethLikeReserve } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { gnosis } from 'viem/chains'
import { BaseUnitNumber } from '../types/NumericValues'
import { useSexyDaiRedeem } from './useSexyDaiRedeem'

const owner = testAddresses.alice
const receiver = testAddresses.bob
const sharesAmount = BaseUnitNumber(10)
const sDai = testAddresses.token
const mode = 'withdraw'
const reserveAddresses = [daiLikeReserve.token.address, wethLikeReserve.token.address]

const hookRenderer = setupHookRenderer({
  hook: useSexyDaiRedeem,
  account: owner,
  chain: gnosis,
  handlers: [handlers.chainIdCall({ chainId: gnosis.id }), handlers.balanceCall({ balance: 0n, address: owner })],
  args: { sDai, sharesAmount, mode },
})

describe(useSexyDaiRedeem.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled for 0 value', async () => {
    const { result } = hookRenderer({ args: { sharesAmount: BaseUnitNumber(0), sDai, mode } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { enabled: false, sDai, sharesAmount, mode } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('redeems xDAI', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: savingsXDaiAdapterAddress[gnosis.id],
          abi: savingsXDaiAdapterAbi,
          functionName: 'redeemXDAI',
          args: [toBigInt(sharesAmount), owner],
          from: owner,
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

  it('redeems xDAI with custom receiver', async () => {
    const { result } = hookRenderer({
      args: {
        sharesAmount,
        receiver,
        sDai,
        reserveAddresses,
        mode: 'send',
      },
      extraHandlers: [
        handlers.contractCall({
          to: savingsXDaiAdapterAddress[gnosis.id],
          abi: savingsXDaiAdapterAbi,
          functionName: 'redeemXDAI',
          args: [toBigInt(sharesAmount), receiver],
          from: owner,
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
