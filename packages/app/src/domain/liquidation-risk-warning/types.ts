import { NormalizedUnitNumber } from '../types/NumericValues'
import { Token } from '../types/Token'

export type SavingsRiskWarning =
  | {
      type: 'savings-deposit-discrepancy-threshold-hit'
      discrepancy: NormalizedUnitNumber
      token: Token
    }
  | {
      type: 'savings-withdraw-discrepancy-threshold-hit'
      discrepancy: NormalizedUnitNumber
      token: Token
    }

export type LiquidationRiskWarning =
  | {
      type: 'liquidation-warning-borrow'
    }
  | {
      type: 'liquidation-warning-withdraw'
    }
  | {
      type: 'liquidation-warning-set-collateral'
    }
  | {
      type: 'liquidation-warning-e-mode-off'
    }

export type RiskWarning = SavingsRiskWarning | LiquidationRiskWarning

export interface RiskAcknowledgementInfo {
  onStatusChange: (acknowledged: boolean) => void
  warning?: RiskWarning
}
