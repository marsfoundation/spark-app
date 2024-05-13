import { SwapInfo } from '@/domain/exchanges/types'
import { PotParams } from '@/domain/maker-info/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { RiskWarning } from '@/features/dialogs/common/components/risk-acknowledgement/RiskAcknowledgement'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { convertSharesToDai } from '@/features/savings/logic/projections'

const WARNING_DISCREPANCY_THRESHOLD = 100

export interface GenerateWarningArgs {
  swapInfo: SwapInfo
  inputValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  potParams: PotParams
  timestamp: number
}

export interface GenerateWarningResults {
  warning?: RiskWarning
}

export function generateWarning({
  swapInfo,
  inputValues,
  marketInfo,
  potParams,
  timestamp,
}: GenerateWarningArgs): GenerateWarningResults {
  if (!swapInfo.data) {
    return {}
  }

  const sDAI = marketInfo.findOneTokenBySymbol(TokenSymbol('sDAI'))
  const DAI = marketInfo.findOneTokenBySymbol(TokenSymbol('DAI'))
  const inputToken = inputValues.token

  const fromAmountDAI = convertSharesToDai({
    shares: sDAI.fromBaseUnit(swapInfo.data.estimate.fromAmount),
    timestamp,
    potParams,
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
