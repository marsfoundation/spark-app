import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
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
  actionsContext: InjectedActionsContext
  pageStatus: PageStatus
  form: UseFormReturn<AssetInputSchema>
  currentHealthFactor?: BigNumber
  updatedHealthFactor?: BigNumber
  riskAcknowledgement: RiskAcknowledgementInfo
}

export function useBorrowDialog({ initialToken }: UseBorrowDialogOptions): UseBorrowDialogResult {
  const { aaveData } = useAaveDataLayer()
  const { marketInfo } = useMarketInfo()
  const { marketInfo: marketInfoIn1Epoch } = useMarketInfo({ timeAdvance: EPOCH_LENGTH })
  const walletInfo = useMarketWalletInfo()
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
  const {
    debouncedFormValues: tokenToBorrow,
    isDebouncing,
    isFormValid,
  } = useDebouncedDialogFormValues({
    form,
    marketInfo,
  })

  const assetsToBorrowFields = getFormFieldsForBorrowDialog({
    form,
    marketInfo,
    marketInfoIn1Epoch,
    walletInfo,
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

  const { riskAcknowledgement, disableActionsByRisk } = useLiquidationRiskWarning({
    type: 'liquidation-warning-borrow',
    isFormValid,
    currentHealthFactor,
    updatedHealthFactor,
  })

  const actionsEnabled = tokenToBorrow.value.gt(0) && isFormValid && !isDebouncing && !disableActionsByRisk

  return {
    borrowOptions,
    assetsToBorrowFields,
    tokenToBorrow,
    objectives: actions,
    actionsContext: {
      marketInfo,
    },
    pageStatus: {
      actionsEnabled,
      state: pageStatus,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    form,
    currentHealthFactor,
    updatedHealthFactor,
    riskAcknowledgement,
  }
}
