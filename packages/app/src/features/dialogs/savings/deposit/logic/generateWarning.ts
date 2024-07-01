import { SwapInfo } from '@/domain/exchanges/types'
import { RiskWarning } from '@/domain/liquidation-risk-warning/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'

// note: this won't work with "100" and condition "gt" because of precision issues
const WARNING_DISCREPANCY_THRESHOLD = 101

export interface GenerateWarningArgs {
  swapInfo: SwapInfo
  inputValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  savingsInfo: SavingsInfo
}

export interface GenerateWarningResults {
  warning?: RiskWarning
}

export function generateWarning({
  swapInfo,
  inputValues,
  marketInfo,
  savingsInfo,
}: GenerateWarningArgs): GenerateWarningResults {
  if (!swapInfo.data) {
    return {}
  }

  const sDAI = marketInfo.sDAI
  const DAI = marketInfo.DAI
  const toAmountMinDAI = savingsInfo.convertSharesToDai({
    shares: sDAI.fromBaseUnit(swapInfo.data.estimate.toAmountMin),
  })

  const discrepancy = NormalizedUnitNumber(inputValues.value.minus(toAmountMinDAI))
  if (discrepancy.gte(WARNING_DISCREPANCY_THRESHOLD)) {
    return {
      warning: {
        type: 'savings-deposit-discrepancy-threshold-hit',
        token: DAI,
        discrepancy,
      },
    }
  }

  return {}
}
