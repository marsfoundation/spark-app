import { Farm } from '@/domain/farms/types'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog } from '@/features/dialogs/common/types'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { UseFormReturn } from 'react-hook-form'

export interface GetFormFieldsForWithdrawDialogParams {
  form: UseFormReturn<AssetInputSchema>
  tokensInfo: TokensInfo
  farm: Farm
}

export function getFormFieldsForUnstakeDialog({
  form,
  tokensInfo,
  farm,
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

  const usdStakedBalance = farm.stakingToken.toUSD(farm.staked)
  const tokenBalance = NormalizedUnitNumber(usdStakedBalance.dividedBy(token.unitPriceUsd))

  return {
    selectedAsset: {
      value,
      token,
      balance: tokenBalance,
    },
    changeAsset,
    maxValue: tokenBalance,
    maxSelectedFieldName: 'isMaxSelected',
  }
}
