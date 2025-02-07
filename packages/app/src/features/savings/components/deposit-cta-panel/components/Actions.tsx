import { Button } from '@/ui/atoms/button/Button'
import { cn } from '@/ui/utils/style'
import { DepositCTAPanelProps } from '../DepositCTAPanel'

export interface ActionsProps {
  actions: DepositCTAPanelProps['actions']
  className?: string
}

export function Actions({ actions, className }: ActionsProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      <Button variant="primary" size="l" onClick={actions.primary.action}>
        {actions.primary.title}
      </Button>
      <Button variant="secondary" size="l" onClick={actions.secondary.action} disabled={actions.secondary.isInSandbox}>
        {actions.secondary.title}
      </Button>
    </div>
  )
}
