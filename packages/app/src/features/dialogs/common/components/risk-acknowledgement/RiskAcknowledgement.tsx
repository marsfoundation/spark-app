import { ReactNode } from 'react'

import { LabeledSwitch } from '@/ui/molecules/labeled-switch/LabeledSwitch'

import { Alert } from '../alert/Alert'

export interface RiskAcknowledgementProps {
  children: ReactNode
  onRiskAcknowledged: () => void
}

export function RiskAcknowledgement({ children, onRiskAcknowledged }: RiskAcknowledgementProps) {
  return (
    <div className="flex flex-col gap-2">
      <Alert variant="danger">
        <div className="text-basics-black text-sm">{children}</div>
      </Alert>
      <LabeledSwitch
        onCheckedChange={(checked) => {
          if (checked) {
            onRiskAcknowledged()
          }
        }}
      >
        <div className="text-basics-black text-sm font-semibold">I acknowledge risks involved</div>
      </LabeledSwitch>
    </div>
  )
}
