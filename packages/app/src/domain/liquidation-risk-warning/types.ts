export type RiskWarning =
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

export interface RiskAcknowledgementInfo {
  onStatusChange: (acknowledged: boolean) => void
  warning?: RiskWarning
}
