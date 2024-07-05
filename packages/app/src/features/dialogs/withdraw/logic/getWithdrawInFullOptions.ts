import { UseFormReturn } from 'react-hook-form'

import { getWithdrawMaxValue } from '@/domain/action-max-value-getters/getWithdrawMaxValue'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { AssetInputSchema, isMaxValue } from '../../common/logic/form'

interface UseWithdrawInFullOptionsResult {
  withdrawInFull: boolean
  maxWithdrawValue: NormalizedUnitNumber
}

export function getWithdrawInFullOptions(
  form: UseFormReturn<AssetInputSchema>,
  marketInfo: MarketInfo,
): UseWithdrawInFullOptionsResult {
  const { symbol } = form.getValues()
  const position = marketInfo.findOnePositionBySymbol(symbol)

  const maxWithdrawValue = getWithdrawMaxValue({
    user: {
      deposited: position.collateralBalance,
      healthFactor: marketInfo.userPositionSummary.healthFactor,
      totalBorrowsUSD: marketInfo.userPositionSummary.totalBorrowsUSD,
      eModeState: marketInfo.userConfiguration.eModeState,
    },
    asset: {
      status: position.reserve.status,
      liquidationThreshold: position.reserve.liquidationThreshold,
      unborrowedLiquidity: position.reserve.unborrowedLiquidity,
      unitPriceUsd: position.reserve.token.unitPriceUsd,
      decimals: position.reserve.token.decimals,
      eModeCategory: position.reserve.eModeCategory,
    },
  })

  const withdrawInFull = isMaxWithdrawal(form, maxWithdrawValue)

  return { withdrawInFull, maxWithdrawValue }
}

export function isMaxWithdrawal(form: UseFormReturn<AssetInputSchema>, maxValue: NormalizedUnitNumber): boolean {
  const { value } = form.getValues()
  return isMaxValue(value, maxValue)
}
