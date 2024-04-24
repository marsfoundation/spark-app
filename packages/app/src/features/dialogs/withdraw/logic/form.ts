import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { NativeAssetInfo } from '@/config/chain/types'
import { AaveData } from '@/domain/market-info/aave-data-layer/query'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { updatePositionSummary } from '@/domain/market-info/updatePositionSummary'
import { validateWithdraw, withdrawalValidationIssueToMessage } from '@/domain/market-validators/validateWithdraw'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'

import { AssetInputSchema, normalizeDialogFormValues } from '../../common/logic/form'
import { FormFieldsForDialog } from '../../common/types'

export interface GetWithdrawDialogFormValidatorOptions {
  marketInfo: MarketInfo
  aaveData: AaveData
  nativeAssetInfo: NativeAssetInfo
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getWithdrawDialogFormValidator({
  marketInfo,
  aaveData,
  nativeAssetInfo,
}: GetWithdrawDialogFormValidatorOptions) {
  return AssetInputSchema.superRefine((field, ctx) => {
    const formWithdrawAsset = normalizeDialogFormValues(field, marketInfo)
    const reserve = marketInfo.findOneReserveBySymbol(formWithdrawAsset.token.symbol)
    const deposited = marketInfo.findOnePositionBySymbol(formWithdrawAsset.token.symbol).collateralBalance

    const updatedUserSummary = updatePositionSummary({
      withdrawals: [formWithdrawAsset],
      marketInfo,
      aaveData,
      nativeAssetInfo,
    })

    const validationIssue = validateWithdraw({
      value: formWithdrawAsset.value,
      asset: { status: reserve.status, maxLtv: updatedUserSummary.maxLoanToValue },
      user: { deposited, ltvAfterWithdrawal: updatedUserSummary.loanToValue },
    })
    if (validationIssue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: withdrawalValidationIssueToMessage[validationIssue],
        path: ['value'],
      })
    }
  })
}

export function getFormFieldsForWithdrawDialog(
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
