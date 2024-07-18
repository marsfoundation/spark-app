import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { daiLikeReserve, testAddresses, wethLikeReserve } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { erc4626Abi } from 'viem'
import { mainnet } from 'viem/chains'
import { useVaultRedeem } from './useVaultRedeem'

const owner = testAddresses.alice
const receiver = testAddresses.bob
const sharesAmount = BaseUnitNumber(10)
const vault = testAddresses.token
const mode = 'withdraw'
const reserveAddresses = [daiLikeReserve.token.address, wethLikeReserve.token.address]

const hookRenderer = setupHookRenderer({
  hook: useVaultRedeem,
  account: owner,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: owner })],
  args: { sharesAmount, vault, mode },
})

describe(useVaultRedeem.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled for 0 value', async () => {
    const { result } = hookRenderer({ args: { sharesAmount: BaseUnitNumber(0), vault, mode } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { enabled: false, sharesAmount, vault, mode } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('redeems from vault', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: vault,
          abi: erc4626Abi,
          functionName: 'redeem',
          args: [toBigInt(sharesAmount), owner, owner],
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

  it('redeems from vault with custom receiver', async () => {
    const { result } = hookRenderer({
      args: {
        sharesAmount,
        vault,
        receiver,
        reserveAddresses,
        mode: 'send',
      },
      extraHandlers: [
        handlers.contractCall({
          to: vault,
          abi: erc4626Abi,
          functionName: 'redeem',
          args: [toBigInt(sharesAmount), receiver, owner],
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
