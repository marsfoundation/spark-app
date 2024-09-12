import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog } from '@/features/dialogs/common/types'
import { UseFormReturn } from 'react-hook-form'

export function getFormFieldsForMigrateDialog(
  form: UseFormReturn<AssetInputSchema>,
  tokensInfo: TokensInfo,
): FormFieldsForDialog {
  const { symbol, value } = form.getValues()
  const { token, balance } = tokensInfo.findOneTokenWithBalanceBySymbol(symbol)

  return {
    selectedAsset: {
      value,
      token,
      balance,
    },
    maxSelectedFieldName: 'isMaxSelected',
    maxValue: balance,
  }
}
