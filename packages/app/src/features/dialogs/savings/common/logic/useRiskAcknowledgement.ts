import { useState } from 'react'

export interface useRiskAcknowledgementArgs {
  required: boolean
}

export interface RiskAcknowledgement {
  acknowledged: boolean
  isRiskAcknowledgedOrNotRequired: boolean
  onStatusChange: (acknowledged: boolean) => void
}

export function useRiskAcknowledgement({ required }: useRiskAcknowledgementArgs): RiskAcknowledgement {
  const [acknowledged, setAcknowledged] = useState(false)

  const isRiskAcknowledgedOrNotRequired = !required || acknowledged

  return {
    acknowledged,
    isRiskAcknowledgedOrNotRequired,
    onStatusChange: setAcknowledged,
  }
}
