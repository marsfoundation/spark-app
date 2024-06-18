import { getChainConfigEntry } from '@/config/chain'
import { SwapInfo, SwapParams } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { ExchangeObjective } from '@/features/actions/flavours/exchange/types'
import { NativeDaiDepositObjective } from '@/features/actions/flavours/native-dai-deposit/types'
import { NativeUSDCDepositObjective } from '@/features/actions/flavours/native-usdc-deposit/types'
import { NativeXDaiDepositObjective } from '@/features/actions/flavours/native-xdai-deposit/types'
import { simplifyQueryResult } from '@/features/actions/logic/simplifyQueryResult'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { gnosis, mainnet } from 'viem/chains'

export interface CreateObjectivesParams {
  swapInfo: SwapInfo
  swapParams: SwapParams
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  savingsInfo: SavingsInfo
  chainId: number
}
export function createObjectives({
  swapInfo,
  swapParams,
  formValues,
  marketInfo,
  savingsInfo,
  chainId,
}: CreateObjectivesParams): (
  | ExchangeObjective
  | NativeDaiDepositObjective
  | NativeUSDCDepositObjective
  | NativeXDaiDepositObjective
)[] {
  const nativeObjectives = getNativeObjectivesByChainAndToken({ formValues, marketInfo, chainId })

  return (
    nativeObjectives ?? [
      {
        type: 'exchange',
        swapInfo: simplifyQueryResult(swapInfo),
        swapParams,
        formatAsDAIValue: (amount: NormalizedUnitNumber) =>
          marketInfo.DAI.format(
            savingsInfo.convertSharesToDai({
              shares: amount,
            }),
            { style: 'auto' },
          ),
      },
    ]
  )
}

interface GetNativeObjectivesByChainAndTokenParams {
  marketInfo: MarketInfo
  formValues: DialogFormNormalizedData
  chainId: number
}

function getNativeObjectivesByChainAndToken({
  marketInfo,
  formValues,
  chainId,
}: GetNativeObjectivesByChainAndTokenParams):
  | (NativeDaiDepositObjective | NativeUSDCDepositObjective | NativeXDaiDepositObjective)[]
  | undefined {
  const tokenSymbol = formValues.token.symbol
  const { savingsNativeRouteTokens, id: originChainId } = getChainConfigEntry(chainId)
  const isNativeRouteSupported = savingsNativeRouteTokens.includes(tokenSymbol)

  if (!isNativeRouteSupported) {
    return
  }

  if (originChainId === mainnet.id) {
    if (tokenSymbol === marketInfo.DAI.symbol) {
      return [
        {
          type: 'nativeDaiDeposit',
          value: formValues.value,
          dai: formValues.token,
          sDai: marketInfo.sDAI,
        },
      ]
    }

    if (tokenSymbol === TokenSymbol('USDC')) {
      return [
        {
          type: 'nativeUSDCDeposit',
          value: formValues.value,
          usdc: formValues.token,
          sDai: marketInfo.sDAI,
        },
      ]
    }
  }

  if (originChainId === gnosis.id) {
    if (tokenSymbol === marketInfo.DAI.symbol) {
      return [
        {
          type: 'nativeXDaiDeposit',
          value: formValues.value,
          xDai: formValues.token,
          sDai: marketInfo.sDAI,
        },
      ]
    }
  }
}
