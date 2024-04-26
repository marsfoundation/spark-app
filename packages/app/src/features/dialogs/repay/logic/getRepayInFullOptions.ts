import { UseFormReturn } from 'react-hook-form'

import { getRepayMaxValue } from '@/domain/action-max-value-getters/getRepayMaxValue'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'

import { AssetInputSchema } from '../../common/logic/form'

interface UseRepayInFullOptionsResult {
  repayInFull: boolean
  maxRepayValue: NormalizedUnitNumber
}

export function getRepayInFullOptions(
  form: UseFormReturn<AssetInputSchema>,
  marketInfo: MarketInfo,
  walletInfo: WalletInfo,
): UseRepayInFullOptionsResult {
  const { symbol } = form.getValues()
  const position = marketInfo.findOnePositionBySymbol(symbol)

  const maxRepayValue = getRepayMaxValue({
    user: {
      debt: position.borrowBalance,
      balance: walletInfo.findWalletBalanceForSymbol(symbol),
    },
    asset: {
      status: position.reserve.status,
    },
  })

  const repayInFull = isFullRepay(form, position.borrowBalance, maxRepayValue)

  return { repayInFull, maxRepayValue }
}

function isFullRepay(
  form: UseFormReturn<AssetInputSchema>,
  debt: NormalizedUnitNumber,
  maxRepayValue: NormalizedUnitNumber,
): boolean {
  const { value } = form.getValues()
  const normalizedInputValue = NormalizedUnitNumber(value === '' ? '0' : value)
  if (normalizedInputValue.lt(debt)) {
    return false
  }
  return normalizedInputValue.eq(maxRepayValue)
}
