import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { LIQUIDATION_DANGER_HEALTH_FACTOR_THRESHOLD } from '../common/risk'
import { LiquidationRiskWarning, RiskAcknowledgementInfo } from './types'

export interface UseLiquidationRiskWarningParams {
  type: LiquidationRiskWarning['type']
  currentHealthFactor: BigNumber | undefined
  updatedHealthFactor: BigNumber | undefined
}

export interface UseRiskWarningResult {
  riskAcknowledgment: RiskAcknowledgementInfo
  enableActions: boolean
}

export function useLiquidationRiskWarning({
  type,
  currentHealthFactor,
  updatedHealthFactor,
}: UseLiquidationRiskWarningParams): UseRiskWarningResult {
  const [riskAcknowledged, setRiskAcknowledged] = useState(false)
  const riskAcknowledgment = { onStatusChange: setRiskAcknowledged }
  const showWarning = determineRiskWarning(updatedHealthFactor, currentHealthFactor)

  return {
    riskAcknowledgment: showWarning ? { ...riskAcknowledgment, warning: { type } } : riskAcknowledgment,
    enableActions: !showWarning || riskAcknowledged,
  }
}

function determineRiskWarning(updatedHealthFactor: BigNumber | undefined, currentHealthFactor: BigNumber | undefined) {
  if (!updatedHealthFactor) {
    return false
  }

  const isUpdatedHFInDangerZone = updatedHealthFactor.lt(LIQUIDATION_DANGER_HEALTH_FACTOR_THRESHOLD)
  // @note e.g., Collateral is already disabled; user withdraws it, and the health factor is not changing.
  const hasHFChanged = !currentHealthFactor?.eq(updatedHealthFactor)
  return hasHFChanged && isUpdatedHFInDangerZone
}
