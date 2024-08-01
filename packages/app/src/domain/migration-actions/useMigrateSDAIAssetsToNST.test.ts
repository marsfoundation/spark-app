import { migrationActionsAbi } from '@/config/abis/migrationActionsAbi'
import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { daiLikeReserve, testAddresses, wethLikeReserve } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { describe, expect, test } from 'vitest'
import { allowanceQueryKey } from '../market-operations/allowance/query'
import { marketBalancesQueryKey } from '../wallet/marketBalances'
import { useMigrateSDAIAssetsToNST } from './useMigrateSDAIAssetsToNST'

const sDai = testAddresses.token
const owner = testAddresses.alice
const receiver = testAddresses.bob
const nstAmount = BaseUnitNumber(10)
const mode = 'withdraw'
const reserveAddresses = [daiLikeReserve.token.address, wethLikeReserve.token.address]

const hookRenderer = setupHookRenderer({
  hook: useMigrateSDAIAssetsToNST,
  account: owner,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: owner })],
  args: { sDai, nstAmount, mode },
})

describe(useMigrateSDAIAssetsToNST.name, () => {
  test('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('is not enabled for 0 value', async () => {
    const { result } = hookRenderer({
      args: { nstAmount: BaseUnitNumber(0), sDai, mode },
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({
      args: { enabled: false, sDai, nstAmount, mode },
    })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  test(' migrates from sDai to NST (withdraws) using migration actions', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: MIGRATE_ACTIONS_ADDRESS,
          abi: migrationActionsAbi,
          functionName: 'migrateSDAIAssetsToNST',
          args: [owner, toBigInt(nstAmount)],
          from: owner,
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

  test('migrates from sDai to NST (withdraws) with custom receiver using migration actions', async () => {
    const { result } = hookRenderer({
      args: {
        sDai,
        nstAmount,
        receiver,
        reserveAddresses,
        mode: 'send',
      },
      extraHandlers: [
        handlers.contractCall({
          to: MIGRATE_ACTIONS_ADDRESS,
          abi: migrationActionsAbi,
          functionName: 'migrateSDAIAssetsToNST',
          args: [receiver, toBigInt(nstAmount)],
          from: owner,
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

  test('invalidates allowance and balances queries', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: MIGRATE_ACTIONS_ADDRESS,
          abi: migrationActionsAbi,
          functionName: 'migrateSDAIAssetsToNST',
          args: [owner, toBigInt(nstAmount)],
          from: owner,
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

    expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      allowanceQueryKey({
        token: sDai,
        spender: MIGRATE_ACTIONS_ADDRESS,
        account: owner,
        chainId: mainnet.id,
      }),
    )

    expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      marketBalancesQueryKey({ account: owner, chainId: mainnet.id }),
    )
  })
})
