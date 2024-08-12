import { psmActionsConfig, savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { allowanceQueryKey } from '@/domain/market-operations/allowance/query'
import { calculateGemMinAmountOut } from '@/domain/psm-actions/redeem-and-swap/utils/calculateGemMinAmountOut'
import { assertNativeWithdraw } from '@/domain/savings/assertNativeWithdraw'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import {
  calculateGemConversionFactor,
  isSexyDaiOperation,
  isUsdcPsmActionsOperation,
  isVaultOperation,
} from '@/features/actions/utils/savings'
import { assert, raise } from '@/utils/assert'
import { toBigInt } from '@/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { erc4626Abi } from 'viem'
import { gnosis } from 'viem/chains'
import { WithdrawFromSavingsAction } from '../types'

export function createWithdrawFromSavingsActionConfig(
  action: WithdrawFromSavingsAction,
  context: ActionContext,
): ActionConfig {
  const { account, chainId } = context
  const tokensInfo = context.tokensInfo ?? raise('Tokens info is required for deposit to savings action')

  return {
    getWriteConfig: () => {
      const { token, savingsToken, isMax, mode, receiver: _receiver } = action
      const receiver = mode === 'send' ? _receiver! : account

      const argsAmount = isMax
        ? toBigInt(savingsToken.toBaseUnit(action.amount))
        : toBigInt(token.toBaseUnit(action.amount))

      if (isVaultOperation({ token, savingsToken, tokensInfo, chainId })) {
        return ensureConfigTypes({
          address: savingsToken.address,
          abi: erc4626Abi,
          functionName: isMax ? 'redeem' : 'withdraw',
          args: [argsAmount, receiver, account],
        })
      }

      if (isSexyDaiOperation({ token, savingsToken, tokensInfo, chainId })) {
        return ensureConfigTypes({
          address: savingsXDaiAdapterAddress[gnosis.id],
          abi: savingsXDaiAdapterAbi,
          functionName: isMax ? 'redeemXDAI' : 'withdrawXDAI',
          args: [argsAmount, receiver],
        })
      }

      if (isUsdcPsmActionsOperation({ token, savingsToken, tokensInfo })) {
        const psmActionsAddress = getContractAddress(psmActionsConfig.address, chainId)
        assert(context.savingsDaiInfo, 'Savings info is required for usdc psm withdraw from savings action')

        if (isMax) {
          const assetsAmount = context.savingsDaiInfo.convertToAssets({ shares: action.amount })
          const gemMinAmountOut = calculateGemMinAmountOut({
            gemDecimals: token.decimals,
            assetsTokenDecimals: savingsToken.decimals,
            assetsAmount: toBigInt(
              savingsToken.toBaseUnit(NormalizedUnitNumber(assetsAmount.toFixed(token.decimals, BigNumber.ROUND_DOWN))),
            ),
          })

          return ensureConfigTypes({
            address: psmActionsAddress,
            abi: psmActionsConfig.abi,
            functionName: 'redeemAndSwap',
            args: [receiver, argsAmount, gemMinAmountOut],
          })
        }

        const gemConversionFactor = calculateGemConversionFactor({
          gemDecimals: token.decimals,
          assetsTokenDecimals: savingsToken.decimals,
        })
        const assetsMaxAmountIn = toBigInt(token.toBaseUnit(action.amount).multipliedBy(gemConversionFactor))

        return ensureConfigTypes({
          address: psmActionsAddress,
          abi: psmActionsConfig.abi,
          functionName: 'withdrawAndSwap',
          args: [receiver, argsAmount, assetsMaxAmountIn],
        })
      }

      throw new Error('Not implemented withdraw from savings action')
    },

    invalidates: () => {
      const { token, savingsToken } = action

      if (isVaultOperation({ token, savingsToken, tokensInfo, chainId })) {
        return [getBalancesQueryKeyPrefix({ chainId, account })]
      }

      const allowanceSpender = (() => {
        if (isSexyDaiOperation({ token, savingsToken, tokensInfo, chainId })) {
          return savingsXDaiAdapterAddress[gnosis.id]
        }

        const psmActionsAddress = getContractAddress(psmActionsConfig.address, chainId)
        return psmActionsAddress
      })()

      return [
        allowanceQueryKey({
          token: action.savingsToken.address,
          spender: allowanceSpender,
          account,
          chainId,
        }),
        getBalancesQueryKeyPrefix({ chainId, account }),
      ]
    },

    beforeWriteCheck: () => {
      const reserveAddresses = tokensInfo.all().map(({ token }) => token.address)
      assertNativeWithdraw({ mode: action.mode, receiver: action.receiver, owner: account, reserveAddresses })
    },
  }
}
