import { MarketInfo } from '@/domain/market-info/marketInfo'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { MarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog } from '@/features/dialogs/common/types'
import { UseFormReturn } from 'react-hook-form'

export function getFormFieldsForDepositDialog(
  form: UseFormReturn<AssetInputSchema>,
  marketInfo: MarketInfo,
  walletInfo: MarketWalletInfo,
): FormFieldsForDialog {
  // eslint-disable-next-line func-style
  const changeAsset = (newSymbol: TokenSymbol): void => {
    form.setValue('symbol', newSymbol)
    form.setValue('value', '')
    form.clearErrors()
  }

  const { symbol, value } = form.getValues()
  const token = marketInfo.findOneTokenBySymbol(symbol)
  const balance = walletInfo.findWalletBalanceForSymbol(symbol)

  return {
    selectedAsset: {
      value,
      token,
      balance,
    },
    maxSelectedFieldName: 'isMaxSelected',
    changeAsset,
    maxValue: balance,
  }
}
