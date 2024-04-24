import { useState } from 'react'

import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { eModeCategoryIdToName } from '@/domain/e-mode/constants'
import { EModeCategoryId, EModeCategoryName } from '@/domain/e-mode/types'
import { useAaveDataLayer } from '@/domain/market-info/aave-data-layer/useAaveDataLayer'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import {
  getValidateSetUserEModeArgs,
  SetUserEModeValidationIssue,
  validateSetUserEMode,
} from '@/domain/market-validators/validateSetUserEMode'
import { Objective } from '@/features/actions/logic/types'

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

  return {
    eModeCategories,
    selectedEModeCategoryName: eModeCategoryIdToName[selectedEModeCategoryId],
    actions,
    validationIssue,
    currentPositionOverview,
    updatedPositionOverview,
    pageStatus: {
      state: pageStatus,
      actionsEnabled: !validationIssue,
      goToSuccessScreen: () => setPageStatus('success'),
    },
  }
}
