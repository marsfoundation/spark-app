import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { LIQUIDATION_DANGER_HEALTH_FACTOR_THRESHOLD, LIQUIDATION_HEALTH_FACTOR_THRESHOLD } from '../common/risk'
import { LiquidationRiskWarning, RiskAcknowledgementInfo } from './types'

export interface UseLiquidationRiskWarningParams {
  type: LiquidationRiskWarning['type']
  healthFactor: BigNumber | undefined
}

export interface UseRiskWarningResult {
  riskAcknowledgment: RiskAcknowledgementInfo
  enableActions: boolean
}

export function useLiquidationRiskWarning({
  type,
  healthFactor,
}: UseLiquidationRiskWarningParams): UseRiskWarningResult {
  const [riskAcknowledged, setRiskAcknowledged] = useState(false)
  const riskAcknowledgment = { onStatusChange: setRiskAcknowledged }

  if (
    healthFactor?.gt(LIQUIDATION_HEALTH_FACTOR_THRESHOLD) &&
    healthFactor?.lte(LIQUIDATION_DANGER_HEALTH_FACTOR_THRESHOLD)
  ) {
    return { riskAcknowledgment: { ...riskAcknowledgment, warning: { type } }, enableActions: riskAcknowledged }
  }

  return { riskAcknowledgment, enableActions: true }
}
