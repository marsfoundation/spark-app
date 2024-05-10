import { useState } from 'react'

import { SwapInfo } from '@/domain/exchanges/types'
import { PotParams } from '@/domain/maker-info/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { DialogFormNormalizedData } from '@/features/dialogs/common/logic/form'
import { useTimestamp } from '@/utils/useTimestamp'

import { generateTransactionWarning } from './generateTransactionWarning'

export interface useRiskAcknowledgementArgs {
  swapInfo: SwapInfo
  inputValues: DialogFormNormalizedData
  marketInfo: MarketInfo
  potParams: PotParams
}

export interface RiskAcknowledgementInfo {
  acknowledged: boolean
  isRiskAcknowledgedOrNotRequired: boolean
  onStatusChanged: (acknowledged: boolean) => void
  text?: string
}

export function useRiskAcknowledgement({
  swapInfo,
  marketInfo,
  potParams,
  inputValues,
}: useRiskAcknowledgementArgs): RiskAcknowledgementInfo {
  const [acknowledged, setAcknowledged] = useState(false)
  const { timestamp } = useTimestamp()

  const { text, acknowledgementRequired } = generateTransactionWarning({
    marketInfo,
    potParams,
    swapInfo,
    timestamp,
    inputValues,
  })

  const isRiskAcknowledgedOrNotRequired = !acknowledgementRequired || acknowledged

  return {
    acknowledged,
    isRiskAcknowledgedOrNotRequired,
    onStatusChanged: setAcknowledged,
    text,
  }
}
