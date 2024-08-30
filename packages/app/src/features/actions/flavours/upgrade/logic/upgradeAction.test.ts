import { migrationActionsAbi } from '@/config/abis/migrationActionsAbi'
import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { allowanceQueryKey } from '@/features/actions/flavours/approve/logic/query'
import { testAddresses, testTokens } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { describe, test } from 'vitest'
import { createUpgradeActionConfig } from './upgradeAction'

const account = testAddresses.alice
const upgradeAmount = NormalizedUnitNumber(1)
const DAI = testTokens.DAI
const USDS = testTokens.USDS
const sDAI = testTokens.sDAI
const sUSDS = testTokens.sUSDS
const chainId = mainnet.id

const mockTokensInfo = new TokensInfo(
  [
    { token: DAI, balance: NormalizedUnitNumber(100) },
    { token: sDAI, balance: NormalizedUnitNumber(100) },
    { token: USDS, balance: NormalizedUnitNumber(100) },
    { token: sUSDS, balance: NormalizedUnitNumber(100) },
  ],
  {
    DAI: DAI.symbol,
    sDAI: sDAI.symbol,
    USDS: USDS.symbol,
    sUSDS: sUSDS.symbol,
  },
)

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: {
    action: { type: 'upgrade', fromToken: DAI, toToken: USDS, amount: upgradeAmount },
    context: { tokensInfo: mockTokensInfo },
    enabled: true,
  },
})

describe(createUpgradeActionConfig.name, () => {
  test('upgrades DAI to USDS', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: MIGRATE_ACTIONS_ADDRESS,
          abi: migrationActionsAbi,
          functionName: 'migrateDAIToUSDS',
          args: [account, toBigInt(DAI.toBaseUnit(upgradeAmount))],
          from: account,
          result: undefined,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.state.status).toBe('ready')
    })

    result.current.onAction()

    await waitFor(() => {
      expect(result.current.state.status).toBe('success')
    })

    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      allowanceQueryKey({ token: DAI.address, spender: MIGRATE_ACTIONS_ADDRESS, account, chainId }),
    )
  })

  test('upgrades sDAI to sUSDS', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: { type: 'upgrade', fromToken: sDAI, toToken: sUSDS, amount: upgradeAmount },
        context: { tokensInfo: mockTokensInfo },
        enabled: true,
      },
      extraHandlers: [
        handlers.contractCall({
          to: MIGRATE_ACTIONS_ADDRESS,
          abi: migrationActionsAbi,
          functionName: 'migrateSDAISharesToSUSDS',
          args: [account, toBigInt(sDAI.toBaseUnit(upgradeAmount))],
          from: account,
          result: 1n,
        }),
        handlers.mineTransaction(),
      ],
    })

    await waitFor(() => {
      expect(result.current.state.status).toBe('ready')
    })

    result.current.onAction()

    await waitFor(() => {
      expect(result.current.state.status).toBe('success')
    })

    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      getBalancesQueryKeyPrefix({ account, chainId }),
    )
    await expect(queryInvalidationManager).toHaveReceivedInvalidationCall(
      allowanceQueryKey({ token: sDAI.address, spender: MIGRATE_ACTIONS_ADDRESS, account, chainId }),
    )
  })
})
