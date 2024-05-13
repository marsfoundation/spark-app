import { useState } from 'react'

import { useTimestamp } from '@/utils/useTimestamp'

export interface useRiskAcknowledgementArgs {
  transactionWarningGenerator: WarningGenerator
}

export interface RiskAcknowledgementInfo {
  acknowledged: boolean
  isRiskAcknowledgedOrNotRequired: boolean
  onStatusChange: (acknowledged: boolean) => void
  text?: string
}

export function useRiskAcknowledgement({
  transactionWarningGenerator,
}: useRiskAcknowledgementArgs): RiskAcknowledgementInfo {
  const [acknowledged, setAcknowledged] = useState(false)
  const { timestamp } = useTimestamp()

  const { text, acknowledgementRequired } = transactionWarningGenerator.generate({
    timestamp,
  })

  const isRiskAcknowledgedOrNotRequired = !acknowledgementRequired || acknowledged

  return {
    acknowledged,
    isRiskAcknowledgedOrNotRequired,
    onStatusChange: setAcknowledged,
    text,
  }
}

export interface WarningGenerator {
  generate: (args: GenerateWarningArgs) => GenerateWarningResults
}

export interface GenerateWarningArgs {
  timestamp: number
}

export interface GenerateWarningResults {
  text?: string
  acknowledgementRequired: boolean
}
