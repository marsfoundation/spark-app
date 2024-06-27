import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { RiskAcknowledgementInfo } from '@/domain/liquidation-risk-warning/types'
import { useLiquidationRiskWarning } from '@/domain/liquidation-risk-warning/useLiquidationRiskWarning'
import { useAaveDataLayer } from '@/domain/market-info/aave-data-layer/useAaveDataLayer'
import { updatePositionSummary } from '@/domain/market-info/updatePositionSummary'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { Token } from '@/domain/types/Token'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'
import { Objective } from '@/features/actions/logic/types'
import { zodResolver } from '@hookform/resolvers/zod'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { AssetInputSchema, useDebouncedDialogFormValues } from '../../common/logic/form'
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
  riskAcknowledgement: RiskAcknowledgementInfo
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
  const {
    debouncedFormValues: tokenToBorrow,
    isDebouncing,
    isFormValid,
  } = useDebouncedDialogFormValues({
    form,
    marketInfo,
  })
  const actions = createBorrowObjectives(tokenToBorrow)

  const updatedUserSummary = updatePositionSummary({
    borrows: [tokenToBorrow],
    marketInfo,
    aaveData,
    nativeAssetInfo,
  })

  const currentHealthFactor = marketInfo.userPositionSummary.healthFactor
  const updatedHealthFactor = !tokenToBorrow.value.eq(0) ? updatedUserSummary.healthFactor : undefined

  const liquidationRiskWarning = useLiquidationRiskWarning({
    type: 'liquidation-warning-borrow',
    healthFactor: updatedHealthFactor,
  })

  const actionsEnabled =
    tokenToBorrow.value.gt(0) && isFormValid && !isDebouncing && liquidationRiskWarning.enableActions

  return {
    borrowOptions,
    assetsToBorrowFields,
    tokenToBorrow,
    objectives: actions,
    pageStatus: {
      state: pageStatus,
      actionsEnabled: actionsEnabled,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    form,
    currentHealthFactor,
    updatedHealthFactor,
    riskAcknowledgement: liquidationRiskWarning.riskAcknowledgment,
  }
}
