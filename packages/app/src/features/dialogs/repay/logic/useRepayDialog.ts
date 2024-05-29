import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'

import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useConditionalFreeze } from '@/domain/hooks/useConditionalFreeze'
import { useAaveDataLayer } from '@/domain/market-info/aave-data-layer/useAaveDataLayer'
import { updatePositionSummary } from '@/domain/market-info/updatePositionSummary'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { Token } from '@/domain/types/Token'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'
import { Objective } from '@/features/actions/logic/types'

import { AssetInputSchema, useDebouncedDialogFormValues } from '../../common/logic/form'
import { useUpdateFormMaxValue } from '../../common/logic/useUpdateFormMaxValue'
import { FormFieldsForDialog, PageState, PageStatus } from '../../common/types'
import { getRepayOptions, getTokenDebt } from './assets'
import { getFormFieldsForRepayDialog, getRepayDialogFormValidator } from './form'
import { getRepayInFullOptions } from './getRepayInFullOptions'
import { makeUpdatedPositionOverview } from './positionOverview'
import { PositionOverview } from './types'
import { useCreateRepayObjectives } from './useCreateRepayObjectives'

export interface UseRepayDialogOptions {
  initialToken: Token
}

export interface UseRepayDialogResult {
  repayOptions: TokenWithBalance[]
  assetsToRepayFields: FormFieldsForDialog
  repaymentAsset: TokenWithValue
  objectives: Objective[]
  pageStatus: PageStatus
  form: UseFormReturn<AssetInputSchema>
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}

export function useRepayDialog({ initialToken }: UseRepayDialogOptions): UseRepayDialogResult {
  const { aaveData } = useAaveDataLayer()
  const { marketInfo } = useMarketInfo()
  const nativeAssetInfo = getNativeAssetInfo(marketInfo.chainId)
  const walletInfo = useWalletInfo()

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getRepayDialogFormValidator(marketInfo, walletInfo)),
    defaultValues: {
      symbol: initialToken.symbol,
      value: '',
    },
    mode: 'onChange',
  })

  const { repayInFull, maxRepayValue } = getRepayInFullOptions(form, marketInfo, walletInfo)
  useUpdateFormMaxValue({ isMaxSet: repayInFull, maxValue: maxRepayValue, token: initialToken, form })

  const repayOptions = getRepayOptions({
    token: initialToken,
    marketInfo,
    walletInfo,
    nativeAssetInfo,
  })

  const {
    debouncedFormValues: formValues,
    isDebouncing,
    isFormValid,
  } = useDebouncedDialogFormValues({
    form,
    marketInfo,
    capValue: maxRepayValue,
  })
  const repaymentAsset = useConditionalFreeze(formValues, pageStatus === 'success')

  const assetsToRepayFields = getFormFieldsForRepayDialog(form, marketInfo, walletInfo, maxRepayValue)

  const debt = getTokenDebt(marketInfo, repaymentAsset)

  const objectives = useCreateRepayObjectives(repaymentAsset, { all: repayInFull })

  const currentPositionOverview = {
    healthFactor: marketInfo.userPositionSummary.healthFactor,
    debt,
  }

  const updatedUserSummary = updatePositionSummary({
    repays: [repaymentAsset],
    marketInfo,
    aaveData,
    nativeAssetInfo,
  })

  const updatedPositionOverview = repaymentAsset.value.eq(0)
    ? undefined
    : makeUpdatedPositionOverview({
        healthFactor: updatedUserSummary.healthFactor,
        debt,
      })

  return {
    form,
    repayOptions,
    assetsToRepayFields,
    repaymentAsset,
    objectives,
    pageStatus: {
      state: pageStatus,
      actionsEnabled: repaymentAsset.value.gt(0) && isFormValid && !isDebouncing,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    currentPositionOverview,
    updatedPositionOverview,
  }
}
