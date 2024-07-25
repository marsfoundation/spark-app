import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { LIQUIDATION_DANGER_HEALTH_FACTOR_THRESHOLD } from '../common/risk'
import { RiskAcknowledgementInfo, RiskWarning } from './types'

export interface UseLiquidationRiskWarningParams {
  type: RiskWarning['type']
  isFormValid: boolean
  currentHealthFactor: BigNumber | undefined
  updatedHealthFactor: BigNumber | undefined
}

export interface UseRiskWarningResult {
  riskAcknowledgement: RiskAcknowledgementInfo
  disableActionsByRisk: boolean
}

export function useLiquidationRiskWarning({
  type,
  isFormValid,
  currentHealthFactor,
  updatedHealthFactor,
}: UseLiquidationRiskWarningParams): UseRiskWarningResult {
  const [riskAcknowledged, setRiskAcknowledged] = useState(false)
  const riskAcknowledgement = { onStatusChange: setRiskAcknowledged }
  const showWarning = determineIfRiskWarning(updatedHealthFactor, currentHealthFactor, isFormValid)

  return {
    riskAcknowledgement: showWarning ? { ...riskAcknowledgement, warning: { type } } : riskAcknowledgement,
    disableActionsByRisk: showWarning && !riskAcknowledged,
  }
}

function determineIfRiskWarning(
  updatedHealthFactor: BigNumber | undefined,
  currentHealthFactor: BigNumber | undefined,
  isFormValid: boolean,
): boolean {
  if (!updatedHealthFactor || !isFormValid) {
    return false
  }

  const isUpdatedHFInDangerZone = updatedHealthFactor.lt(LIQUIDATION_DANGER_HEALTH_FACTOR_THRESHOLD)
  // @note This check applies when a user attempts to withdraw disabled collateral. Even if position in the danger zone, no warning should be displayed.
  const hasHFChanged = !currentHealthFactor?.eq(updatedHealthFactor)
  return hasHFChanged && isUpdatedHFInDangerZone
}
