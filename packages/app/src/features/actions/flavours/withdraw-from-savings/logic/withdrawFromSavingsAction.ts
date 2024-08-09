import { psmActionsConfig, savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { allowanceQueryKey } from '@/domain/market-operations/allowance/query'
import { calculateGemMinAmountOut } from '@/domain/psm-actions/redeem-and-swap/utils/calculateGemMinAmountOut'
import { calculateGemConversionFactor } from '@/domain/psm-actions/utils/calculateGemConversionFactor'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { assert, raise } from '@/utils/assert'
import { toBigInt } from '@/utils/bigNumber'
import { QueryKey } from '@tanstack/react-query'
import { erc4626Abi } from 'viem'
import { gnosis } from 'viem/chains'
import { WithdrawFromSavingsAction } from '../types'

export function createWithdrawFromSavingsAction(
  action: WithdrawFromSavingsAction,
  context: ActionContext,
): ActionConfig {
  const { account, chainId } = context
  const tokensInfo = context.tokensInfo ?? raise('Tokens info is required for deposit to savings action')
  const sDaiSavingsInfo = context.sDaiSavingsInfo ?? raise('Savings info is required for withdraw from savings action')
  const psmActionsAddress = getContractAddress(psmActionsConfig.address, chainId)

  return {
    getWriteConfig: () => {
      const { token, savingsToken, amount, isMax, mode, receiver: _receiver } = action

      assert(mode === 'send' && _receiver !== undefined, 'Receiver address should be defined when sending')
      const receiver = mode === 'send' ? _receiver : account
      const amountArg = isMax ? toBigInt(savingsToken.toBaseUnit(amount)) : toBigInt(token.toBaseUnit(amount))

      if (isVaultWithdraw({ action, tokensInfo, chainId })) {
        ensureConfigTypes({
          address: savingsToken.address,
          abi: erc4626Abi,
          functionName: isMax ? 'redeem' : 'withdraw',
          args: [amountArg, receiver, account],
        })
      }

      if (isSexyDaiWithdraw({ action, tokensInfo, chainId })) {
        ensureConfigTypes({
          address: savingsXDaiAdapterAddress[gnosis.id],
          abi: savingsXDaiAdapterAbi,
          functionName: isMax ? 'redeemXDAI' : 'withdrawXDAI',
          args: [amountArg, receiver],
        })
      }

      if (isPSMActionsWithdraw({ action, tokensInfo })) {
        if (isMax) {
          const assetsAmount = sDaiSavingsInfo.convertToAssets({ shares: amount })
          const gemMinAmountOut = calculateGemMinAmountOut({
            gemDecimals: token.decimals,
            assetsTokenDecimals: savingsToken.decimals,
            assetsAmount: toBigInt(savingsToken.toBaseUnit(assetsAmount)),
          })
          return ensureConfigTypes({
            address: psmActionsAddress,
            abi: psmActionsConfig.abi,
            functionName: 'redeemAndSwap',
            args: [account, amountArg, gemMinAmountOut],
          })
        }

        const gemConversionFactor = calculateGemConversionFactor({
          gemDecimals: token.decimals,
          assetsTokenDecimals: savingsToken.decimals,
        })
        const assetsMaxAmountIn = toBigInt(amount.multipliedBy(gemConversionFactor))

        return ensureConfigTypes({
          address: psmActionsAddress,
          abi: psmActionsConfig.abi,
          functionName: 'withdrawAndSwap',
          args: [receiver, amountArg, assetsMaxAmountIn],
        })
      }

      throw new Error('Not implemented withdraw from savings action')
    },

    invalidates: () => {
      const queryKeys: QueryKey[] = [getBalancesQueryKeyPrefix({ chainId, account })]

      if (isVaultWithdraw({ action, tokensInfo, chainId })) {
        queryKeys
      }

      const allowanceSpender = (() => {
        if (isSexyDaiWithdraw({ action, tokensInfo, chainId })) {
          return savingsXDaiAdapterAddress[gnosis.id]
        }

        return psmActionsAddress
      })()

      const allowanceKey = allowanceQueryKey({
        token: action.savingsToken.address,
        spender: allowanceSpender,
        account,
        chainId,
      })

      return [allowanceKey, ...queryKeys]
    },
  }
}

function isVaultWithdraw({
  action,
  tokensInfo,
  chainId,
}: { action: WithdrawFromSavingsAction; tokensInfo: TokensInfo; chainId: number }): boolean {
  const { token, savingsToken } = action
  if (isSexyDaiWithdraw({ action, tokensInfo, chainId })) {
    return false
  }

  return (
    (token.symbol === tokensInfo.DAI?.symbol && savingsToken.symbol === tokensInfo.sDAI?.symbol) ||
    (token.symbol === tokensInfo.NST?.symbol && savingsToken.symbol === tokensInfo.sNST?.symbol)
  )
}

function isSexyDaiWithdraw({
  action,
  tokensInfo,
  chainId,
}: { action: WithdrawFromSavingsAction; tokensInfo: TokensInfo; chainId: number }): boolean {
  const { token, savingsToken } = action
  return (
    token.symbol === tokensInfo.DAI?.symbol && savingsToken.symbol === tokensInfo.sDAI?.symbol && chainId === gnosis.id
  )
}

function isPSMActionsWithdraw({
  action,
  tokensInfo,
}: { action: WithdrawFromSavingsAction; tokensInfo: TokensInfo }): boolean {
  const { token, savingsToken } = action
  return token.symbol === TokenSymbol('USDC') && savingsToken.symbol === tokensInfo.sDAI?.symbol
}
