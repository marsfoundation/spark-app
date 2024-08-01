import { migrationActionsAbi } from '@/config/abis/migrationActionsAbi'
import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { testAddresses } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupHookRenderer } from '@/test/integration/setupHookRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { allowanceQueryKey } from '../market-operations/allowance/query'
import { marketBalancesQueryKey } from '../wallet/marketBalances'
import { useMigrateDAIToSNST } from './useMigrateDAIToSNST'

const dai = testAddresses.token
const daiAmount = BaseUnitNumber(1)
const account = testAddresses.alice

const hookRenderer = setupHookRenderer({
  hook: useMigrateDAIToSNST,
  account,
  handlers: [handlers.chainIdCall({ chainId: mainnet.id }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    dai,
    daiAmount,
  },
})

describe(useMigrateDAIToSNST.name, () => {
  it('is not enabled for guest ', async () => {
    const { result } = hookRenderer({ account: undefined })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled for 0 dai amount', async () => {
    const { result } = hookRenderer({ args: { dai, daiAmount: BaseUnitNumber(0) } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('is not enabled when explicitly disabled', async () => {
    const { result } = hookRenderer({ args: { enabled: false, dai, daiAmount } })

    await waitFor(() => {
      expect(result.current.status.kind).toBe('disabled')
    })
  })

  it('deposits dai into sNST using migration actions', async () => {
    const { result } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: MIGRATE_ACTIONS_ADDRESS,
          abi: migrationActionsAbi,
          functionName: 'migrateDAIToSNST',
          args: [account, toBigInt(daiAmount)],
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

  test('invalidates allowance and balances queries', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: MIGRATE_ACTIONS_ADDRESS,
          abi: migrationActionsAbi,
          functionName: 'migrateDAIToSNST',
          args: [account, toBigInt(daiAmount)],
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

    expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      allowanceQueryKey({
        token: dai,
        spender: MIGRATE_ACTIONS_ADDRESS,
        account,
        chainId: mainnet.id,
      }),
    )

    expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      marketBalancesQueryKey({ account, chainId: mainnet.id }),
    )
  })
})
