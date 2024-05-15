import { SwapInfo } from '@/domain/exchanges/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
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

  const sDAI = marketInfo.findOneTokenBySymbol(TokenSymbol('sDAI'))
  const DAI = marketInfo.findOneTokenBySymbol(TokenSymbol('DAI'))
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
