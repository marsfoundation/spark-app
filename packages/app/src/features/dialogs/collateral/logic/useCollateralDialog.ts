import BigNumber from 'bignumber.js'
import { useState } from 'react'

import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { TokenWithBalance } from '@/domain/common/types'
import { useAaveDataLayer } from '@/domain/market-info/aave-data-layer/useAaveDataLayer'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import {
  SetUseAsCollateralValidationIssue,
  getValidateSetUseAsCollateralArgs,
  validateSetUseAsCollateral,
} from '@/domain/market-validators/validateSetUseAsCollateral'
import { Token } from '@/domain/types/Token'
import { Objective } from '@/features/actions/logic/types'

import { PageState, PageStatus } from '../../common/types'
import { createCollateralObjectives } from './createCollateralObjectives'
import { getUpdatedUserSummary } from './getUpdatedUserSummary'

export interface UseCollateralDialogParams {
  useAsCollateral: boolean
  token: Token
}

export interface UseCollateralDialogResult {
  collateral: TokenWithBalance
  objectives: Objective[]
  validationIssue: SetUseAsCollateralValidationIssue | undefined
  pageStatus: PageStatus
  currentHealthFactor?: BigNumber
  updatedHealthFactor?: BigNumber
}

export function useCollateralDialog({ useAsCollateral, token }: UseCollateralDialogParams): UseCollateralDialogResult {
  const { aaveData } = useAaveDataLayer()
  const { marketInfo } = useMarketInfo()
  const nativeAssetInfo = getNativeAssetInfo(marketInfo.chainId)

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const collateralPosition = marketInfo.findOnePositionByToken(token)
  const currentHealthFactor = marketInfo.userPositionSummary.healthFactor
  const collateral = { token, balance: collateralPosition.collateralBalance }

  const { healthFactor: updatedHealthFactor } = getUpdatedUserSummary({
    useAsCollateral,
    token,
    marketInfo,
    aaveData,
    nativeAssetInfo,
  })
  const objectives = createCollateralObjectives(token, useAsCollateral)

  const validationIssue = validateSetUseAsCollateral(
    getValidateSetUseAsCollateralArgs({
      useAsCollateral,
      collateral: token,
      healthFactorAfterWithdrawal: updatedHealthFactor,
      marketInfo,
    }),
  )

  return {
    objectives,
    collateral,
    validationIssue,
    currentHealthFactor,
    updatedHealthFactor,
    pageStatus: {
      state: pageStatus,
      actionsEnabled: !validationIssue,
      goToSuccessScreen: () => setPageStatus('success'),
    },
  }
}
