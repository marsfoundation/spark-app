import { getRepayMaxValue } from '@/domain/action-max-value-getters/getRepayMaxValue'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '../../common/logic/form'

export interface ProcessRepaymentAssetParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: WalletInfo
}

export function processRepaymentAsset({
  formValues,
  marketInfo,
  walletInfo,
}: ProcessRepaymentAssetParams): DialogFormNormalizedData {
  if (!formValues.isMaxSelected) {
    return formValues
  }

  const position = marketInfo.findOnePositionBySymbol(formValues.token.symbol)
  const balance = walletInfo.findWalletBalanceForSymbol(formValues.token.symbol)
  const debt = position.borrowBalance

  const repayMaxValue = getRepayMaxValue({
    user: {
      balance,
      debt,
    },
    asset: {
      status: position.reserve.status,
    },
  })

  return {
    ...formValues,
    value: repayMaxValue,
  }
}
