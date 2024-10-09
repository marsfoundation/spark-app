import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { useConditionalFreeze } from '@/domain/hooks/useConditionalFreeze'
import { RiskAcknowledgementInfo } from '@/domain/liquidation-risk-warning/types'
import { useLiquidationRiskWarning } from '@/domain/liquidation-risk-warning/useLiquidationRiskWarning'
import { useAaveDataLayer } from '@/domain/market-info/aave-data-layer/useAaveDataLayer'
import { EPOCH_LENGTH } from '@/domain/market-info/consts'
import { updatePositionSummary } from '@/domain/market-info/updatePositionSummary'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { Token } from '@/domain/types/Token'
import { useMarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useChainId } from 'wagmi'
import { AssetInputSchema, useDebouncedDialogFormValues } from '../../common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '../../common/types'
import { getTokenSupply, getWithdrawOptions } from './assets'
import { getFormFieldsForWithdrawDialog, getWithdrawDialogFormValidator } from './form'
import { createWithdrawObjectives } from './objectives'
import { PositionOverview } from './types'

export interface UseWithdrawDialogOptions {
  initialToken: Token
}

export interface UseWithdrawDialogResult {
  withdrawOptions: TokenWithBalance[]
  assetsToWithdrawFields: FormFieldsForDialog
  withdrawAsset: TokenWithValue
  objectives: Objective[]
  actionsContext: InjectedActionsContext
  pageStatus: PageStatus
  form: UseFormReturn<AssetInputSchema>
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
  riskAcknowledgement: RiskAcknowledgementInfo
}

export function useWithdrawDialog({ initialToken }: UseWithdrawDialogOptions): UseWithdrawDialogResult {
  const chainId = useChainId()
  const { aaveData } = useAaveDataLayer({ chainId })
  const { marketInfo } = useMarketInfo({ chainId })
  const { marketInfo: marketInfoIn1Epoch } = useMarketInfo({ timeAdvance: EPOCH_LENGTH, chainId })
  const walletInfo = useMarketWalletInfo({ chainId })
  const nativeAssetInfo = getNativeAssetInfo(marketInfo.chainId)

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getWithdrawDialogFormValidator({ marketInfo, aaveData, nativeAssetInfo })),
    defaultValues: {
      symbol: initialToken.symbol,
      value: '',
    },
    mode: 'onChange',
  })

  const withdrawOptions = getWithdrawOptions({
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
  const withdrawAsset = useConditionalFreeze(formValues, pageStatus === 'success')

  const assetsToWithdrawFields = getFormFieldsForWithdrawDialog(form, marketInfo, walletInfo)

  const updatedTokenSupply = getTokenSupply(marketInfo, withdrawAsset)

  const objectives = createWithdrawObjectives({
    formValues: withdrawAsset,
    marketInfoIn1Epoch,
  })

  const currentPositionOverview = {
    healthFactor: marketInfo.userPositionSummary.healthFactor,
    tokenSupply: formValues.position.collateralBalance,
    supplyAPY: withdrawAsset.reserve.supplyAPY,
  }
  const updatedUserSummary = updatePositionSummary({
    withdrawals: [withdrawAsset],
    marketInfo,
    aaveData,
    nativeAssetInfo,
  })
  const updatedPositionOverview = withdrawAsset.value.eq(0)
    ? undefined
    : {
        ...currentPositionOverview,
        healthFactor: updatedUserSummary.healthFactor,
        tokenSupply: updatedTokenSupply,
      }
  const { riskAcknowledgement, disableActionsByRisk } = useLiquidationRiskWarning({
    type: 'liquidation-warning-withdraw',
    isFormValid,
    currentHealthFactor: currentPositionOverview.healthFactor,
    updatedHealthFactor: updatedPositionOverview?.healthFactor,
  })

  const actionsEnabled = withdrawAsset.value.gt(0) && isFormValid && !isDebouncing && !disableActionsByRisk

  return {
    form,
    withdrawOptions,
    assetsToWithdrawFields,
    withdrawAsset,
    objectives,
    actionsContext: {
      marketInfo,
    },
    pageStatus: {
      actionsEnabled,
      state: pageStatus,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    currentPositionOverview,
    updatedPositionOverview,
    riskAcknowledgement,
  }
}
