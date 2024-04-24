import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { getDepositMaxValue } from '@/domain/action-max-value-getters/getDepositMaxValue'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { depositValidationIssueToMessage, validateDeposit } from '@/domain/market-validators/validateDeposit'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'

import { AssetInputSchema } from '../../common/logic/form'
import { FormFieldsForDialog } from '../../common/types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getDepositDialogFormValidator(walletInfo: WalletInfo, marketInfo: MarketInfo) {
  return AssetInputSchema.superRefine((field, ctx) => {
    const value = NormalizedUnitNumber(field.value === '' ? '0' : field.value)
    const balance = walletInfo.findWalletBalanceForSymbol(field.symbol)
    const supplyingReserve = marketInfo.findOneReserveBySymbol(field.symbol)

    const issue = validateDeposit({
      value,
      asset: {
        status: supplyingReserve.status,
        totalLiquidity: supplyingReserve.totalLiquidity,
        supplyCap: supplyingReserve.supplyCap,
      },
      user: { balance, alreadyDepositedValueUSD: NormalizedUnitNumber('0') },
    })
    if (issue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: depositValidationIssueToMessage[issue],
        path: ['value'],
      })
    }
  })
}

export interface GetFormFieldsForDepositDialogArgs {
  form: UseFormReturn<AssetInputSchema>
  marketInfo: MarketInfo
  walletInfo: WalletInfo
}
export function getFormFieldsForDepositDialog({
  form,
  marketInfo,
  walletInfo,
}: GetFormFieldsForDepositDialogArgs): FormFieldsForDialog {
  // eslint-disable-next-line func-style
  const changeAsset = (newSymbol: TokenSymbol): void => {
    form.setValue('symbol', newSymbol)
    form.setValue('value', '')
    form.clearErrors()
  }

  const { symbol, value } = form.getValues()
  const position = marketInfo.findOnePositionBySymbol(symbol)

  const maxValue = getDepositMaxValue({
    asset: {
      status: position.reserve.status,
      totalDebt: position.reserve.totalDebt,
      decimals: position.reserve.token.decimals,
      index: position.reserve.variableBorrowIndex,
      rate: position.reserve.variableBorrowRate,
      lastUpdateTimestamp: position.reserve.lastUpdateTimestamp,
      totalLiquidity: position.reserve.totalLiquidity,
      supplyCap: position.reserve.supplyCap,
    },
    user: {
      balance: walletInfo.findWalletBalanceForSymbol(symbol),
    },
    timestamp: marketInfo.timestamp,
  })

  return {
    selectedAsset: {
      token: marketInfo.findOneTokenBySymbol(symbol),
      value,
      balance: walletInfo.findWalletBalanceForSymbol(symbol),
    },
    changeAsset,
    maxValue,
  }
}
