import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog } from '@/features/dialogs/common/types'
import { UseFormReturn } from 'react-hook-form'

export interface GetFormFieldsForWithdrawDialogParams {
  form: UseFormReturn<AssetInputSchema>
  tokensInfo: TokensInfo
  savingsTokenWithBalance: TokenWithBalance
  savingsInfo: SavingsInfo
  timestamp: number
}

export function getFormFieldsForWithdrawDialog({
  form,
  tokensInfo,
  savingsTokenWithBalance,
  savingsInfo,
  timestamp,
}: GetFormFieldsForWithdrawDialogParams): FormFieldsForDialog {
  // eslint-disable-next-line func-style
  const changeAsset = (newSymbol: TokenSymbol): void => {
    form.setValue('symbol', newSymbol)
    form.setValue('value', '')
    form.setValue('isMaxSelected', false)

    form.clearErrors()
  }

  const { symbol, value } = form.getValues()
  const token = tokensInfo.findOneTokenBySymbol(symbol)
  const usdBalance = savingsInfo.predictAssetsAmount({
    shares: savingsTokenWithBalance.balance,
    timestamp,
  })

  return {
    selectedAsset: {
      value,
      token,
      balance: usdBalance,
    },
    changeAsset,
    maxValue: usdBalance,
    maxSelectedFieldName: 'isMaxSelected',
  }
}
