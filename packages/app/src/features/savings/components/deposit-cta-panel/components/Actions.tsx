import { Button } from '@/ui/atoms/button/Button'
import { DepositCTAPanelProps } from '../DepositCTAPanel'

export interface ActionsProps {
  actions: DepositCTAPanelProps['actions']
}

export function Actions({ actions }: ActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="primary" size="l" onClick={actions.primary.action}>
        {actions.primary.title}
      </Button>
      <Button variant="secondary" size="l" onClick={actions.secondary.action}>
        {actions.secondary.title}
      </Button>
    </div>
  )
}
