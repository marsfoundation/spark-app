import { SwapInfo } from '@/domain/exchanges/types'
import { PotParams } from '@/domain/maker-info/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { convertSharesToDai } from '@/features/savings/logic/projections'

import {
  GenerateWarningArgs,
  GenerateWarningResults,
  WarningGenerator,
} from '../../common/logic/useRiskAcknowledgement'

const WARNING_DISCREPANCY_THRESHOLD = 100

export interface DepositWarningGeneratorArgs {
  swapInfo: SwapInfo
  inputValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  potParams: PotParams
}

export class DepositWarningGenerator implements WarningGenerator {
  constructor(readonly args: DepositWarningGeneratorArgs) {}

  generate({ timestamp }: GenerateWarningArgs): GenerateWarningResults {
    const { swapInfo, inputValues, marketInfo, potParams } = this.args
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
    if (discrepancy.gte(WARNING_DISCREPANCY_THRESHOLD)) {
      return {
        text: `Market fluctuations can impact your transaction value. The final amount received may be less than the deposit amount by up to ${DAI.format(discrepancy, { style: 'auto' })} DAI.`,
        acknowledgementRequired: true,
      }
    }

    return {
      acknowledgementRequired: false,
    }
  }
}
