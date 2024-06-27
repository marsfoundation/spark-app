import BigNumber from 'bignumber.js'

export type RiskLevel = 'liquidation' | 'risky' | 'moderate' | 'healthy' | 'unknown' | 'no debt'

export const LIQUIDATION_HEALTH_FACTOR_THRESHOLD = new BigNumber(1)
export const LIQUIDATION_DANGER_HEALTH_FACTOR_THRESHOLD = new BigNumber(1.2)
export const RISKY_HEALTH_FACTOR_THRESHOLD = new BigNumber(2)
export const MODERATE_HEALTH_FACTOR_THRESHOLD = new BigNumber(3)

export function healthFactorToRiskLevel(hf: BigNumber | undefined): RiskLevel {
  if (hf === undefined) {
    return 'unknown'
  }

  switch (true) {
    case !hf.isFinite():
      return 'no debt'

    case hf.lt(LIQUIDATION_HEALTH_FACTOR_THRESHOLD):
      return 'liquidation'

    case hf.lt(RISKY_HEALTH_FACTOR_THRESHOLD):
      return 'risky'

    case hf.lt(MODERATE_HEALTH_FACTOR_THRESHOLD):
      return 'moderate'

    default:
      return 'healthy'
  }
}

export const riskLevelToTitle: Record<RiskLevel, string> = {
  unknown: 'Unknown',
  liquidation: 'Liquidation',
  risky: 'Risky',
  moderate: 'Moderate',
  healthy: 'Healthy',
  'no debt': 'No debt',
}
