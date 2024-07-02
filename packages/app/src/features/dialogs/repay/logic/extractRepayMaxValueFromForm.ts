import { getRepayMaxValue } from '@/domain/action-max-value-getters/getRepayMaxValue'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { DialogFormNormalizedData } from '../../common/logic/form'

export interface ExtractRepayMaxValueFromFormParams {
  formValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  walletInfo: WalletInfo
}

export function extractRepayMaxValueFromForm({
  formValues,
  marketInfo,
  walletInfo,
}: ExtractRepayMaxValueFromFormParams): NormalizedUnitNumber {
  const position = marketInfo.findOnePositionBySymbol(formValues.token.symbol)
  const balance = walletInfo.findWalletBalanceForSymbol(formValues.token.symbol)
  const debt = position.borrowBalance

  return getRepayMaxValue({
    user: {
      balance,
      debt,
    },
    asset: {
      status: position.reserve.status,
    },
  })
}
