import { UseFormReturn } from 'react-hook-form'

import { TokenWithBalance } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog } from '@/features/dialogs/common/types'

interface getFormFieldsForWithdrawDialogParams {
  form: UseFormReturn<AssetInputSchema>
  marketInfo: MarketInfo
  sDaiWithBalance: TokenWithBalance
}

export function getFormFieldsForWithdrawDialog({
  form,
  marketInfo,
  sDaiWithBalance,
}: getFormFieldsForWithdrawDialogParams): FormFieldsForDialog {
  // eslint-disable-next-line func-style
  const changeAsset = (newSymbol: TokenSymbol): void => {
    form.setValue('symbol', newSymbol)
    form.setValue('value', '')
    form.setValue('isMaxSelected', false)

    form.clearErrors()
  }

  const { symbol, value } = form.getValues()
  const token = marketInfo.findOneTokenBySymbol(symbol)
  const usdBalance = sDaiWithBalance.token.toUSD(sDaiWithBalance.balance)

  return {
    selectedAsset: {
      value,
      token,
      balance: usdBalance,
    },
    changeAsset,
    maxValue: undefined,
    maxSelectedFieldName: 'isMaxSelected',
  }
}
