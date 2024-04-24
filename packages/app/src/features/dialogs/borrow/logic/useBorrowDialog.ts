import { zodResolver } from '@hookform/resolvers/zod'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'

import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useAaveDataLayer } from '@/domain/market-info/aave-data-layer/useAaveDataLayer'
import { updatePositionSummary } from '@/domain/market-info/updatePositionSummary'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { Token } from '@/domain/types/Token'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'
import { Objective } from '@/features/actions/logic/types'

import { AssetInputSchema, normalizeDialogFormValues } from '../../common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '../../common/types'
import { getBorrowOptions } from './assets'
import { createBorrowObjectives } from './createBorrowObjectives'
import { getBorrowDialogFormValidator, getFormFieldsForBorrowDialog } from './form'

export interface UseBorrowDialogOptions {
  initialToken: Token
}

export interface UseBorrowDialogResult {
  borrowOptions: TokenWithBalance[]
  assetsToBorrowFields: FormFieldsForDialog
  tokenToBorrow: TokenWithValue
  objectives: Objective[]
  pageStatus: PageStatus
  form: UseFormReturn<AssetInputSchema>
  currentHealthFactor?: BigNumber
  updatedHealthFactor?: BigNumber
}

export function useBorrowDialog({ initialToken }: UseBorrowDialogOptions): UseBorrowDialogResult {
  const { aaveData } = useAaveDataLayer()
  const { marketInfo } = useMarketInfo()
  const walletInfo = useWalletInfo()
  const nativeAssetInfo = getNativeAssetInfo(marketInfo.chainId)

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getBorrowDialogFormValidator(marketInfo)),
    defaultValues: {
      symbol: initialToken.symbol,
      value: '',
    },
    mode: 'onChange',
  })

  const borrowOptions = getBorrowOptions({
    token: initialToken,
    marketInfo,
    walletInfo,
    nativeAssetInfo,
  })
  const assetsToBorrowFields = getFormFieldsForBorrowDialog(form, marketInfo, walletInfo)
  const tokenToBorrow = normalizeDialogFormValues(form.watch(), marketInfo)
  const actions = createBorrowObjectives(tokenToBorrow)

  const updatedUserSummary = updatePositionSummary({
    borrows: [tokenToBorrow],
    marketInfo,
    aaveData,
    nativeAssetInfo,
  })

  const currentHealthFactor = marketInfo.userPositionSummary.healthFactor
  const updatedHealthFactor = !tokenToBorrow.value.eq(0) ? updatedUserSummary.healthFactor : undefined

  return {
    borrowOptions,
    assetsToBorrowFields,
    tokenToBorrow,
    objectives: actions,
    pageStatus: {
      state: pageStatus,
      actionsEnabled: tokenToBorrow.value.gt(0) && form.formState.isValid,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    form,
    currentHealthFactor,
    updatedHealthFactor,
  }
}
