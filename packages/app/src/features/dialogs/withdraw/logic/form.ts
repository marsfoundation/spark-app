import { NativeAssetInfo } from '@/config/chain/types'
import { getWithdrawMaxValue } from '@/domain/action-max-value-getters/getWithdrawMaxValue'
import { AaveData } from '@/domain/market-info/aave-data-layer/query'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { updatePositionSummary } from '@/domain/market-info/updatePositionSummary'
import { validateWithdraw, withdrawalValidationIssueToMessage } from '@/domain/market-validators/validateWithdraw'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { MarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
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
      asset: {
        status: reserve.status,
        unborrowedLiquidity: reserve.unborrowedLiquidity,
        eModeCategory: reserve.eModes[0]?.category,
      },
      user: {
        deposited,
        liquidationThreshold: updatedUserSummary.currentLiquidationThreshold,
        ltvAfterWithdrawal: updatedUserSummary.loanToValue,
        eModeState: marketInfo.userConfiguration.eModeState,
      },
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
  walletInfo: MarketWalletInfo,
): FormFieldsForDialog {
  // eslint-disable-next-line func-style
  const changeAsset = (newSymbol: TokenSymbol): void => {
    form.setValue('symbol', newSymbol)
    form.setValue('value', '')
    form.clearErrors()
  }

  const { symbol, value } = form.getValues()
  const position = marketInfo.findOnePositionBySymbol(symbol)

  const maxWithdrawValue = getWithdrawMaxValue({
    user: {
      deposited: position.collateralBalance,
      healthFactor: marketInfo.userPositionSummary.healthFactor,
      totalBorrowsUSD: marketInfo.userPositionSummary.totalBorrowsUSD,
      eModeState: marketInfo.userConfiguration.eModeState,
    },
    asset: {
      status: position.reserve.status,
      liquidationThreshold: position.reserve.liquidationThreshold,
      unborrowedLiquidity: position.reserve.unborrowedLiquidity,
      unitPriceUsd: position.reserve.token.unitPriceUsd,
      decimals: position.reserve.token.decimals,
      usageAsCollateralEnabledOnUser: position.reserve.usageAsCollateralEnabledOnUser,
      eModeCategory: position.reserve.eModes[0]?.category,
    },
  })

  return {
    selectedAsset: {
      value,
      token: marketInfo.findOneTokenBySymbol(symbol),
      balance: walletInfo.findWalletBalanceForSymbol(symbol),
    },
    maxSelectedFieldName: 'isMaxSelected',
    changeAsset,
    maxValue: maxWithdrawValue,
  }
}
