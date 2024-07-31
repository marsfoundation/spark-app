import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog } from '@/features/dialogs/common/types'
import { UseFormReturn } from 'react-hook-form'

export function getFormFieldsForDepositDialog(
  form: UseFormReturn<AssetInputSchema>,
  tokensInfo: TokensInfo,
): FormFieldsForDialog {
  // eslint-disable-next-line func-style
  const changeAsset = (newSymbol: TokenSymbol): void => {
    form.setValue('symbol', newSymbol)
    form.setValue('value', '')
    form.clearErrors()
  }

  const { symbol, value } = form.getValues()
  const { token, balance } = tokensInfo.findOneTokenWithBalanceBySymbol(symbol)

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
