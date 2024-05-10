import { SwapInfo } from '@/domain/exchanges/types'
import { PotParams } from '@/domain/maker-info/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { convertSharesToDai } from '@/features/savings/logic/projections'

export interface GenerateTransactionWarningArgs {
  swapInfo: SwapInfo
  inputValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  potParams: PotParams
  timestamp: number
}

export interface GenerateTransactionWarningResults {
  text?: string
  acknowledgementRequired: boolean
}

export function generateTransactionWarning({
  swapInfo,
  inputValues,
  marketInfo,
  potParams,
  timestamp,
}: GenerateTransactionWarningArgs): GenerateTransactionWarningResults {
  if (!swapInfo.data) {
    return {
      acknowledgementRequired: false,
    }
  }

  const sDAI = marketInfo.findOneTokenBySymbol(TokenSymbol('sDAI'))
  const DAI = marketInfo.findOneTokenBySymbol(TokenSymbol('DAI'))
  const toAmountMinDAI = convertSharesToDai({
    shares: sDAI.fromBaseUnit(swapInfo.data.estimate.toAmountMin),
    timestamp,
    potParams,
  })

  const discrepancy = NormalizedUnitNumber(inputValues.value.minus(toAmountMinDAI))
  if (discrepancy.gte(100)) {
    return {
      text: `Market fluctuations can impact your transaction value, and the final amount received may be less than the deposit amount by ${DAI.format(discrepancy, { style: 'auto' })} DAI.`,
      acknowledgementRequired: true,
    }
  }

  return {
    acknowledgementRequired: false,
  }
}
