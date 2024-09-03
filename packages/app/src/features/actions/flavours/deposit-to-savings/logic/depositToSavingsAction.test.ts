import { migrationActionsAbi } from '@/config/abis/migrationActionsAbi'
import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { psmActionsAbi, psmActionsAddress } from '@/config/contracts-generated'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { allowanceQueryKey } from '@/features/actions/flavours/approve/logic/query'
import { testAddresses, testTokens } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { erc4626Abi } from 'viem'
import { mainnet } from 'viem/chains'
import { describe, test } from 'vitest'
import { createDepositToSavingsActionConfig } from './depositToSavingsAction'

const account = testAddresses.alice
const depositValue = NormalizedUnitNumber(1)
const dai = testTokens.DAI
const sdai = testTokens.sDAI
const usds = testTokens.USDS
const susds = testTokens.sUSDS
const usdc = testTokens.USDC
const mockTokensInfo = new TokensInfo(
  [
    { token: dai, balance: NormalizedUnitNumber(100) },
    { token: sdai, balance: NormalizedUnitNumber(100) },
    { token: usds, balance: NormalizedUnitNumber(100) },
    { token: susds, balance: NormalizedUnitNumber(100) },
    { token: usdc, balance: NormalizedUnitNumber(100) },
  ],
  {
    DAI: dai.symbol,
    sDAI: sdai.symbol,
    USDS: usds.symbol,
    sUSDS: susds.symbol,
  },
)
const chainId = mainnet.id

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { action: { type: 'depositToSavings', token: dai, savingsToken: sdai, value: depositValue }, enabled: true },
})

describe(createDepositToSavingsActionConfig.name, () => {
  test('deposits dai to sdai', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: { type: 'depositToSavings', token: dai, savingsToken: sdai, value: depositValue },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      chain: mainnet,
      extraHandlers: [
        handlers.chainIdCall({ chainId }),
        handlers.contractCall({
          to: sdai.address,
          abi: erc4626Abi,
          functionName: 'deposit',
          args: [toBigInt(dai.toBaseUnit(depositValue)), account],
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
      allowanceQueryKey({ token: dai.address, spender: sdai.address, account, chainId }),
    )
  })

  test('deposits usdc to sdai', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: { type: 'depositToSavings', token: usdc, savingsToken: sdai, value: depositValue },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      extraHandlers: [
        handlers.contractCall({
          to: psmActionsAddress[mainnet.id],
          abi: psmActionsAbi,
          functionName: 'swapAndDeposit',
          args: [
            account,
            toBigInt(usdc.toBaseUnit(depositValue)),
            toBigInt(usdc.toBaseUnit(depositValue).multipliedBy(1e12)),
          ],
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
      allowanceQueryKey({ token: usdc.address, spender: psmActionsAddress[mainnet.id], account, chainId }),
    )
  })

  test('migrates dai to susds', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      args: {
        action: { type: 'depositToSavings', token: dai, savingsToken: susds, value: depositValue },
        enabled: true,
        context: { tokensInfo: mockTokensInfo },
      },
      extraHandlers: [
        handlers.contractCall({
          to: MIGRATE_ACTIONS_ADDRESS,
          abi: migrationActionsAbi,
          functionName: 'migrateDAIToSUSDS',
          args: [account, toBigInt(dai.toBaseUnit(depositValue))],
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
      allowanceQueryKey({ token: dai.address, spender: MIGRATE_ACTIONS_ADDRESS, account, chainId }),
    )
  })
})
