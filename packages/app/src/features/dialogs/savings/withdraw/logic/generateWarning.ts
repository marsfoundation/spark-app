import { SwapInfo } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { RiskWarning } from '@/features/dialogs/common/components/risk-acknowledgement/RiskAcknowledgement'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'

const WARNING_DISCREPANCY_THRESHOLD = 100

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
  const inputToken = inputValues.token

  const fromAmountDAI = savingsInfo.convertSharesToDai({
    shares: sDAI.fromBaseUnit(swapInfo.data.estimate.fromAmount),
  })
  const toAmountMinDAI = inputToken.fromBaseUnit(swapInfo.data.estimate.toAmountMin)

  const discrepancy = NormalizedUnitNumber(fromAmountDAI.minus(toAmountMinDAI))
  if (discrepancy.gte(WARNING_DISCREPANCY_THRESHOLD)) {
    return {
      warning: {
        type: 'savings-withdraw-discrepancy-threshold-hit',
        token: DAI,
        discrepancy,
      },
    }
  }

  return {}
}
