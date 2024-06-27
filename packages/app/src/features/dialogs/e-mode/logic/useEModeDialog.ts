import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { eModeCategoryIdToName } from '@/domain/e-mode/constants'
import { EModeCategoryId, EModeCategoryName } from '@/domain/e-mode/types'
import { RiskAcknowledgementInfo } from '@/domain/liquidation-risk-warning/types'
import { useLiquidationRiskWarning } from '@/domain/liquidation-risk-warning/useLiquidationRiskWarning'
import { useAaveDataLayer } from '@/domain/market-info/aave-data-layer/useAaveDataLayer'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import {
  SetUserEModeValidationIssue,
  getValidateSetUserEModeArgs,
  validateSetUserEMode,
} from '@/domain/market-validators/validateSetUserEMode'
import { Objective } from '@/features/actions/logic/types'
import { useState } from 'react'
import { PageState, PageStatus } from '../../common/types'
import { EModeCategory, PositionOverview } from '../types'
import { createEModeObjectives } from './createEModeObjectives'
import { getEModeCategories } from './getEModeCategories'
import { getUpdatedPositionOverview } from './getUpdatedPositionOverview'

interface UseEModeDialogParams {
  userEModeCategoryId: EModeCategoryId
}

export interface UseEModeDialogResult {
  eModeCategories: Record<EModeCategoryName, EModeCategory>
  selectedEModeCategoryName: EModeCategoryName
  actions?: Objective[]
  validationIssue?: SetUserEModeValidationIssue
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
  pageStatus: PageStatus
  riskAcknowledgement: RiskAcknowledgementInfo
}

export function useEModeDialog({ userEModeCategoryId }: UseEModeDialogParams): UseEModeDialogResult {
  const { aaveData } = useAaveDataLayer()
  const { marketInfo } = useMarketInfo()
  const nativeAssetInfo = getNativeAssetInfo(marketInfo.chainId)

  const [pageStatus, setPageStatus] = useState<PageState>('form')
  const [selectedEModeCategoryId, setSelectedEModeCategoryId] = useState<EModeCategoryId>(userEModeCategoryId)

  const currentPositionOverview = {
    healthFactor: marketInfo.userPositionSummary.healthFactor,
    maxLTV: marketInfo.userPositionSummary.maxLoanToValue,
  }

  const updatedPositionOverview = getUpdatedPositionOverview({
    marketInfo,
    aaveData,
    currentEModeCategoryId: userEModeCategoryId,
    selectedEModeCategoryId,
    nativeAssetInfo,
  })

  const eModeCategories = getEModeCategories(marketInfo, selectedEModeCategoryId, setSelectedEModeCategoryId)

  const actions = createEModeObjectives(userEModeCategoryId, selectedEModeCategoryId)

  const validationIssue = updatedPositionOverview
    ? validateSetUserEMode(
        getValidateSetUserEModeArgs({
          requestedEModeCategoryId: selectedEModeCategoryId,
          healthFactorAfterChangingEMode: updatedPositionOverview.healthFactor,
          marketInfo,
        }),
      )
    : undefined

  const { riskAcknowledgement, disableActionsByRisk } = useLiquidationRiskWarning({
    type: 'liquidation-warning-e-mode-off',
    isFormValid: !validationIssue,
    currentHealthFactor: currentPositionOverview.healthFactor,
    updatedHealthFactor: updatedPositionOverview?.healthFactor,
  })

  const actionsEnabled = !validationIssue && !disableActionsByRisk

  return {
    eModeCategories,
    selectedEModeCategoryName: eModeCategoryIdToName[selectedEModeCategoryId],
    actions,
    validationIssue,
    currentPositionOverview,
    updatedPositionOverview,
    pageStatus: {
      state: pageStatus,
      actionsEnabled,
      goToSuccessScreen: () => setPageStatus('success'),
    },
    riskAcknowledgement,
  }
}
