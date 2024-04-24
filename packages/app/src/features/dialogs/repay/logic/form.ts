import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { MarketInfo } from '@/domain/market-info/marketInfo'
import { repayValidationIssueToMessage, validateRepay } from '@/domain/market-validators/validateRepay'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'

import { AssetInputSchema, normalizeDialogFormValues } from '../../common/logic/form'
import { FormFieldsForDialog } from '../../common/types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getRepayDialogFormValidator(marketInfo: MarketInfo, walletInfo: WalletInfo) {
  return AssetInputSchema.superRefine((field, ctx) => {
    const formRepayAsset = normalizeDialogFormValues(field, marketInfo)
    const reserve = marketInfo.findOneReserveBySymbol(field.symbol)
    const debt = marketInfo.findOnePositionBySymbol(field.symbol).borrowBalance

    const token = marketInfo.findOneTokenBySymbol(field.symbol)
    const balance = walletInfo.findWalletBalanceForToken(token)

    const validateIssue = validateRepay({
      value: formRepayAsset.value,
      asset: {
        status: reserve.status,
      },
      user: {
        debt,
        balance,
      },
    })
    if (validateIssue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: repayValidationIssueToMessage[validateIssue],
        path: ['value'],
      })
    }
  })
}

export function getFormFieldsForRepayDialog(
  form: UseFormReturn<AssetInputSchema>,
  marketInfo: MarketInfo,
  walletInfo: WalletInfo,
  maxValue: NormalizedUnitNumber,
): FormFieldsForDialog {
  // eslint-disable-next-line func-style
  const changeAsset = (newSymbol: TokenSymbol): void => {
    form.setValue('symbol', newSymbol)
    form.setValue('value', '')
    form.clearErrors()
  }

  const { symbol, value } = form.getValues()

  return {
    selectedAsset: {
      value,
      token: marketInfo.findOneTokenBySymbol(symbol),
      balance: walletInfo.findWalletBalanceForSymbol(symbol),
    },
    changeAsset,
    maxValue,
  }
}
