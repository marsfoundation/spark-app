import BigNumber from 'bignumber.js'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

import { getDepositMaxValue } from '@/domain/action-max-value-getters/getDepositMaxValue'
import { formFormat } from '@/domain/common/format'
import { TokenWithBalance } from '@/domain/common/types'
import { MarketInfo, Reserve, UserPositionSummary } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'

import { EasyBorrowFormNormalizedData } from '../types'
import { EasyBorrowFormSchema } from './validation'

export function getDefaultFormValues(borrowableAssets: Reserve[], depositableAssets: Reserve[]): EasyBorrowFormSchema {
  // @todo apply better algorithm to select default assets, take into account balances etc
  const defaultBorrowableAsset = borrowableAssets[0]!
  const defaultDepositableAsset = depositableAssets[0]!

  return {
    assetsToBorrow: [{ symbol: defaultBorrowableAsset.token.symbol, value: '' }],
    assetsToDeposit: [{ symbol: defaultDepositableAsset.token.symbol, value: '' }],
  }
}

export interface FormFieldsForAssetClass {
  selectedAssets: TokenWithBalance[]
  allAssets: TokenWithBalance[]
  assetToMaxValue: Record<TokenSymbol, NormalizedUnitNumber>
  changeAsset: (index: number, newSymbol: TokenSymbol) => void
  addAsset: () => void
  removeAsset: (index: number) => void
}

export interface UseFormFieldsForAssetClassArgs {
  form: UseFormReturn<EasyBorrowFormSchema>
  marketInfo: MarketInfo
  allPossibleReserves: Reserve[]
  walletInfo: WalletInfo
  type: 'borrow' | 'deposit'
}
export function useFormFieldsForAssetClass({
  form,
  marketInfo,
  allPossibleReserves,
  walletInfo,
  type,
}: UseFormFieldsForAssetClassArgs): FormFieldsForAssetClass {
  const { append, remove } = useFieldArray({
    control: form.control,
    name: getFormKeyBasedOnType(type),
  })
  const fields = form.getValues(getFormKeyBasedOnType(type))

  const reservesAvailableToPick = allPossibleReserves.filter(
    (reserve) => !fields.some((f) => f.symbol === reserve.token.symbol),
  )

  const allAssets = allPossibleReserves.map((reserve): TokenWithBalance => {
    return {
      token: reserve.token,
      balance: walletInfo.findWalletBalanceForToken(reserve.token),
    }
  })

  const selectedAssets = fields.map((field): TokenWithBalance => {
    const token = marketInfo.findOneTokenBySymbol(field.symbol)

    return {
      token,
      balance: walletInfo.findWalletBalanceForToken(token),
    }
  })

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

  const assetToMaxValue = selectedAssets.reduce(
    (acc, asset) => {
      const position = marketInfo.findOnePositionBySymbol(asset.token.symbol)
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
          balance: walletInfo.findWalletBalanceForSymbol(asset.token.symbol),
        },
        timestamp: marketInfo.timestamp,
      })
      acc[asset.token.symbol] = maxValue
      return acc
    },
    {} as Record<TokenSymbol, NormalizedUnitNumber>,
  )

  // eslint-disable-next-line func-style
  const addAsset = (): void => {
    if (reservesAvailableToPick.length > 0) {
      const reserve = reservesAvailableToPick[0]!
      append({ symbol: reserve.token.symbol, value: '' })
    }
  }

  return {
    selectedAssets,
    allAssets,
    assetToMaxValue,
    changeAsset,
    addAsset,
    removeAsset: remove,
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
