import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { getBorrowMaxValue } from '@/domain/action-max-value-getters/getBorrowMaxValue'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import {
  borrowValidationIssueToMessage,
  getValidateBorrowArgs,
  validateBorrow,
} from '@/domain/market-validators/validateBorrow'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'

import { AssetInputSchema } from '../../common/logic/form'
import { FormFieldsForDialog } from '../../common/types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getBorrowDialogFormValidator(marketInfo: MarketInfo) {
  return AssetInputSchema.superRefine((field, ctx) => {
    const value = NormalizedUnitNumber(field.value === '' ? '0' : field.value)
    const reserve = marketInfo.findOneReserveBySymbol(field.symbol)

    const validationIssue = validateBorrow(getValidateBorrowArgs(value, reserve, marketInfo))

    if (validationIssue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: borrowValidationIssueToMessage[validationIssue],
        path: ['value'],
      })
    }
  })
}

export function getFormFieldsForBorrowDialog(
  form: UseFormReturn<AssetInputSchema>,
  marketInfo: MarketInfo,
  walletInfo: WalletInfo,
): FormFieldsForDialog {
  // eslint-disable-next-line func-style
  const changeAsset = (newSymbol: TokenSymbol): void => {
    form.setValue('symbol', newSymbol)
    form.setValue('value', '')
    form.clearErrors()
  }

  const { symbol, value } = form.getValues()
  const reserve = marketInfo.findOneReserveBySymbol(symbol)

  const borrowValidationArgs = getValidateBorrowArgs(NormalizedUnitNumber(0), reserve, marketInfo)
  const validationIssue = validateBorrow(borrowValidationArgs)

  const maxValue = getBorrowMaxValue({
    validationIssue,
    user: borrowValidationArgs.user,
    asset: borrowValidationArgs.asset,
  })

  return {
    selectedAsset: {
      value,
      token: reserve.token,
      balance: walletInfo.findWalletBalanceForSymbol(symbol),
    },
    changeAsset,
    maxValue,
  }
}
