import { getChainConfigEntry } from '@/config/chain'
import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { ExchangeObjective } from '@/features/actions/flavours/exchange/types'
import { DaiFromSDaiWithdrawObjective } from '@/features/actions/flavours/native-sdai-withdraw/dai-from-sdai/types'
import { USDCFromSDaiWithdrawObjective } from '@/features/actions/flavours/native-sdai-withdraw/usdc-from-sdai/types'
import { XDaiFromSDaiWithdrawObjective } from '@/features/actions/flavours/native-sdai-withdraw/xdai-from-sdai/types'
import { simplifyQueryResult } from '@/features/actions/logic/simplifyQueryResult'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { gnosis, mainnet } from 'viem/chains'
import { Mode } from '../types'

export interface CreateObjectivesParams {
  swapInfo: SwapInfo
  swapParams: SwapParams
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  savingsInfo: SavingsInfo
  chainId: number
  receiver: CheckedAddress | undefined
  mode: Mode
}
export function createObjectives({
  swapInfo,
  swapParams,
  formValues,
  marketInfo,
  walletInfo,
  savingsInfo,
  chainId,
  receiver,
  mode,
}: CreateObjectivesParams): (
  | ExchangeObjective
  | DaiFromSDaiWithdrawObjective
  | USDCFromSDaiWithdrawObjective
  | XDaiFromSDaiWithdrawObjective
)[] {
  const nativeObjectives = getNativeObjectivesByChainAndToken({
    formValues,
    marketInfo,
    savingsInfo,
    walletInfo,
    chainId,
    receiver,
    mode,
  })

  return (
    nativeObjectives ?? [
      {
        type: 'exchange',
        swapInfo: simplifyQueryResult(swapInfo),
        swapParams,
      },
    ]
  )
}

interface GetNativeObjectivesByChainAndTokenParams {
  marketInfo: MarketInfo
  savingsInfo: SavingsInfo
  walletInfo: WalletInfo
  formValues: DialogFormNormalizedData
  chainId: number
  receiver: CheckedAddress | undefined
  mode: Mode
}

function getNativeObjectivesByChainAndToken({
  marketInfo,
  savingsInfo,
  walletInfo,
  formValues,
  chainId,
  receiver,
  mode,
}: GetNativeObjectivesByChainAndTokenParams):
  | (DaiFromSDaiWithdrawObjective | USDCFromSDaiWithdrawObjective | XDaiFromSDaiWithdrawObjective)[]
  | undefined {
  const tokenSymbol = formValues.token.symbol
  const { savingsNativeRouteTokens, id: originChainId } = getChainConfigEntry(chainId)
  const isNativeRouteSupported = savingsNativeRouteTokens.includes(tokenSymbol)

  if (!isNativeRouteSupported) {
    return
  }

  const isMaxSelected = formValues.isMaxSelected
  const sDaiBalance = walletInfo.findWalletBalanceForToken(marketInfo.sDAI)
  const sDaiValueEstimate = savingsInfo.convertDaiToShares({ dai: formValues.value })

  if (originChainId === mainnet.id) {
    if (tokenSymbol === marketInfo.DAI.symbol) {
      return [
        {
          type: 'daiFromSDaiWithdraw',
          dai: formValues.token,
          sDai: marketInfo.sDAI,
          value: isMaxSelected ? sDaiBalance : formValues.value,
          method: isMaxSelected ? 'redeem' : 'withdraw',
          receiver,
          mode,
        },
      ]
    }

    if (tokenSymbol === TokenSymbol('USDC')) {
      return isMaxSelected
        ? [
            {
              type: 'usdcFromSDaiWithdraw',
              usdc: formValues.token,
              value: sDaiBalance,
              sDai: marketInfo.sDAI,
              method: 'redeem',
              receiver,
              mode,
            },
          ]
        : [
            {
              type: 'usdcFromSDaiWithdraw',
              usdc: formValues.token,
              value: formValues.value,
              sDai: marketInfo.sDAI,
              method: 'withdraw',
              sDaiValueEstimate,
              receiver,
              mode,
            },
          ]
    }
  }

  if (originChainId === gnosis.id) {
    if (tokenSymbol === marketInfo.DAI.symbol) {
      return isMaxSelected
        ? [
            {
              type: 'xDaiFromSDaiWithdraw',
              xDai: formValues.token,
              value: sDaiBalance,
              sDai: marketInfo.sDAI,
              method: 'redeem',
              receiver,
              mode,
            },
          ]
        : [
            {
              type: 'xDaiFromSDaiWithdraw',
              xDai: formValues.token,
              value: formValues.value,
              sDai: marketInfo.sDAI,
              method: 'withdraw',
              sDaiValueEstimate,
              receiver,
              mode,
            },
          ]
    }
  }
}
