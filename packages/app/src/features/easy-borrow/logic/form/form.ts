import { getDepositMaxValue } from '@/domain/action-max-value-getters/getDepositMaxValue'
import { formFormat } from '@/domain/common/format'
import { TokenWithBalance } from '@/domain/common/types'
import { MarketInfo, UserPositionSummary } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { MarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { raise } from '@/utils/assert'
import BigNumber from 'bignumber.js'
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { EasyBorrowFormNormalizedData } from '../types'
import { EasyBorrowFormSchema } from './validation'

export interface GetDefaultFormValuesParams {
  borrowOptions: TokenWithBalance[]
  depositOptions: TokenWithBalance[]
}
export function getDefaultFormValues({
  borrowOptions,
  depositOptions,
}: GetDefaultFormValuesParams): EasyBorrowFormSchema {
  // @todo apply better algorithm to select default assets, take into account balances etc
  const defaultBorrowOption = borrowOptions[0]!
  const defaultDepositOption = depositOptions[0]!

  return {
    assetsToBorrow: [{ symbol: defaultBorrowOption.token.symbol, value: '' }],
    assetsToDeposit: [{ symbol: defaultDepositOption.token.symbol, value: '' }],
  }
}

export interface FormFieldsForAssetClass {
  selectedAssets: TokenWithBalance[]
  allAssets: TokenWithBalance[]
  assetToMaxValue: Record<TokenSymbol, NormalizedUnitNumber>
  changeAsset: (index: number, newSymbol: TokenSymbol) => void
  addAsset: () => void
  removeAsset: (index: number) => void
  maxSelectedFieldName?: string
}

export interface UseFormFieldsForAssetClassArgs {
  form: UseFormReturn<EasyBorrowFormSchema>
  marketInfo: MarketInfo
  assetOptions: TokenWithBalance[]
  walletInfo: MarketWalletInfo
  type: 'borrow' | 'deposit'
}
export function useFormFieldsForAssetClass({
  form,
  marketInfo,
  assetOptions,
  walletInfo,
  type,
}: UseFormFieldsForAssetClassArgs): FormFieldsForAssetClass {
  const { append, remove } = useFieldArray({
    control: form.control,
    name: getFormKeyBasedOnType(type),
  })
  const fields = form.getValues(getFormKeyBasedOnType(type))

  const tokensAvailableToPick = assetOptions.filter(({ token }) => !fields.some((f) => f.symbol === token.symbol))

  const selectedAssets = fields.map(
    (field) =>
      assetOptions.find(({ token }) => token.symbol === field.symbol) ??
      raise(`Unknown asset in form: ${field.symbol}`),
  )

  // eslint-disable-next-line func-style
  const changeAsset = (index: number, newSymbol: TokenSymbol): void => {
    form.setValue(
      `${getFormKeyBasedOnType(type)}.${index}`,
      { symbol: newSymbol, value: '' },
      {
        shouldValidate: false,
      },
    )
  }

  const assetToMaxValue =
    type === 'deposit'
      ? selectedAssets.reduce(
          (acc, asset) => {
            const position = marketInfo.findOnePositionBySymbol(asset.token.symbol)
            const maxValue = getDepositMaxValue({
              asset: {
                status: position.reserve.status,
                totalLiquidity: position.reserve.totalLiquidity,
                isNativeAsset: marketInfo.nativeAssetInfo.nativeAssetSymbol === asset.token.symbol,
                supplyCap: position.reserve.supplyCap,
              },
              user: {
                balance: walletInfo.findWalletBalanceForSymbol(asset.token.symbol),
              },
              chain: {
                minRemainingNativeAsset: marketInfo.nativeAssetInfo.minRemainingNativeAssetBalance,
              },
            })
            acc[asset.token.symbol] = maxValue
            return acc
          },
          {} as Record<TokenSymbol, NormalizedUnitNumber>,
        )
      : {}

  // eslint-disable-next-line func-style
  const addAsset = (): void => {
    if (tokensAvailableToPick.length > 0) {
      const token = tokensAvailableToPick[0]?.token!
      append({ symbol: token.symbol, value: '' })
    }
  }

  return {
    selectedAssets,
    allAssets: assetOptions,
    assetToMaxValue,
    changeAsset,
    addAsset,
    removeAsset: remove,
    maxSelectedFieldName: type === 'deposit' ? 'isMaxSelected' : undefined,
  }
}

function getFormKeyBasedOnType(type: 'borrow' | 'deposit'): 'assetsToBorrow' | 'assetsToDeposit' {
  return type === 'borrow' ? 'assetsToBorrow' : 'assetsToDeposit'
}

interface SetDesiredLoanToValueProps {
  control: UseFormReturn<EasyBorrowFormSchema>
  formValues: EasyBorrowFormNormalizedData
  userPositionSummary: UserPositionSummary
  desiredLtv: Percentage
}

export function setDesiredLoanToValue({
  control,
  formValues,
  userPositionSummary,
  desiredLtv,
}: SetDesiredLoanToValueProps): void {
  const borrowedAsset = formValues.borrows[0]!
  const toAdd = userPositionSummary.totalCollateralUSD
    .multipliedBy(desiredLtv)
    .minus(userPositionSummary.totalBorrowsUSD)
    .dividedBy(borrowedAsset.reserve.priceInUSD)

  const current = borrowedAsset.value
  const result = current.plus(toAdd)

  const newBorrowedAssetUnit = BigNumber.max(0, formFormat(result))

  control.setValue('assetsToBorrow.0.value', newBorrowedAssetUnit.toFixed(), {
    shouldValidate: true,
    shouldTouch: true,
  })
}
