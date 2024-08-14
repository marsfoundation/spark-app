import { migrationActionsAbi } from '@/config/abis/migrationActionsAbi'
import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { allowanceQueryKey } from '@/features/actions/flavours/approve/logic/query'
import { testAddresses, testTokens } from '@/test/integration/constants'
import { handlers } from '@/test/integration/mockTransport'
import { setupUseContractActionRenderer } from '@/test/integration/setupUseContractActionRenderer'
import { toBigInt } from '@/utils/bigNumber'
import { waitFor } from '@testing-library/react'
import { mainnet } from 'viem/chains'
import { describe, test } from 'vitest'
import { createDowngradeActionConfig } from './downgradeAction'

const account = testAddresses.alice
const downgradeAmount = NormalizedUnitNumber(1)
const dai = testTokens.DAI
const nst = testTokens.NST
const chainId = mainnet.id

const hookRenderer = setupUseContractActionRenderer({
  account,
  handlers: [handlers.chainIdCall({ chainId }), handlers.balanceCall({ balance: 0n, address: account })],
  args: { action: { type: 'downgrade', fromToken: nst, toToken: dai, amount: downgradeAmount }, enabled: true },
})

describe(createDowngradeActionConfig.name, () => {
  test('downgrades nst to dai', async () => {
    const { result, queryInvalidationManager } = hookRenderer({
      extraHandlers: [
        handlers.contractCall({
          to: MIGRATE_ACTIONS_ADDRESS,
          abi: migrationActionsAbi,
          functionName: 'downgradeNSTToDAI',
          args: [account, toBigInt(dai.toBaseUnit(downgradeAmount))],
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
      allowanceQueryKey({ token: nst.address, spender: MIGRATE_ACTIONS_ADDRESS, account, chainId }),
    )
  })
})
