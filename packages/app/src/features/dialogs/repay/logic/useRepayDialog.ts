import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { getRepayMaxValue } from '@/domain/action-max-value-getters/getRepayMaxValue'
import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useConditionalFreeze } from '@/domain/hooks/useConditionalFreeze'
import { useAaveDataLayer } from '@/domain/market-info/aave-data-layer/useAaveDataLayer'
import { EPOCH_LENGTH } from '@/domain/market-info/consts'
import { updatePositionSummary } from '@/domain/market-info/updatePositionSummary'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { Token } from '@/domain/types/Token'
import { useMarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { Objective } from '@/features/actions/logic/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { AssetInputSchema, DialogFormNormalizedData, useDebouncedDialogFormValues } from '../../common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '../../common/types'
import { getRepayOptions, getTokenDebt } from './assets'
import { getFormFieldsForRepayDialog, getRepayDialogFormValidator } from './form'
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
  const { marketInfo: marketInfoIn1Epoch } = useMarketInfo({ timeAdvance: EPOCH_LENGTH })
  const { marketInfo: marketInfoIn2Epochs } = useMarketInfo({ timeAdvance: 2 * EPOCH_LENGTH })

  const walletInfo = useMarketWalletInfo()

  const nativeAssetInfo = getNativeAssetInfo(marketInfo.chainId)

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getRepayDialogFormValidator(marketInfo, walletInfo)),
    defaultValues: {
      symbol: initialToken.symbol,
      value: '',
      isMaxSelected: false,
    },
    mode: 'onChange',
  })

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
  })
  const repaymentAsset: DialogFormNormalizedData = useConditionalFreeze(formValues, pageStatus === 'success')

  const repayMaxValue = getRepayMaxValue({
    asset: {
      status: repaymentAsset.reserve.status,
      isNativeAsset: formValues.token.symbol === marketInfo.nativeAssetInfo.nativeAssetSymbol,
    },
    user: {
      balance: walletInfo.findWalletBalanceForSymbol(repaymentAsset.token.symbol),
      debt: repaymentAsset.position.borrowBalance,
    },
    chain: {
      minRemainingNativeAsset: marketInfo.nativeAssetInfo.minRemainingNativeAssetBalance,
    },
  })

  const assetsToRepayFields = getFormFieldsForRepayDialog({
    form,
    marketInfo,
    walletInfo,
    repayMaxValue,
  })
  const debt = getTokenDebt(marketInfo, repaymentAsset)
  const objectives = useCreateRepayObjectives({
    repaymentAsset,
    marketInfoIn1Epoch,
    marketInfoIn2Epochs,
    walletInfo,
  })

  const currentPositionOverview = {
    healthFactor: marketInfo.userPositionSummary.healthFactor,
    debt: repaymentAsset.position.borrowBalance,
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
