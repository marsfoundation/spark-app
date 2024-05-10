import { ReactNode } from 'react'

import { LabeledSwitch } from '@/ui/molecules/labeled-switch/LabeledSwitch'

import { Alert } from '../alert/Alert'

export interface RiskAcknowledgementProps {
  children: ReactNode
  onStatusChanged: (acknowledged: boolean) => void
}

export function RiskAcknowledgement({ children, onStatusChanged }: RiskAcknowledgementProps) {
  return (
    <div className="flex flex-col gap-2">
      <Alert variant="danger">
        <div className="text-basics-black text-sm">{children}</div>
      </Alert>
      <LabeledSwitch onCheckedChange={onStatusChanged}>
        <div className="text-basics-black text-sm font-semibold">I acknowledge risks involved</div>
      </LabeledSwitch>
    </div>
  )
}
