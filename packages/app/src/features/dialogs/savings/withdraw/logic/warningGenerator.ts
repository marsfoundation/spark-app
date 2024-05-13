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

export interface WithdrawWarningGeneratorArgs {
  swapInfo: SwapInfo
  marketInfo: MarketInfo
  potParams: PotParams
  inputValues: DialogFormNormalizedData
}

export class WithdrawWarningGenerator implements WarningGenerator {
  constructor(readonly args: WithdrawWarningGeneratorArgs) {}

  generate({ timestamp }: GenerateWarningArgs): GenerateWarningResults {
    const { swapInfo, inputValues, marketInfo, potParams } = this.args

    if (!swapInfo.data) {
      return {
        acknowledgementRequired: false,
      }
    }

    const sDAI = marketInfo.findOneTokenBySymbol(TokenSymbol('sDAI'))
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
        text: `Market fluctuations can impact your transaction value. You may be charged more than the withdraw amount by up to ${inputToken.format(discrepancy, { style: 'auto' })} DAI.`,
        acknowledgementRequired: true,
      }
    }

    return {
      acknowledgementRequired: false,
    }
  }
}
