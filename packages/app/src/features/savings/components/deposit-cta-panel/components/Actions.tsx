import { Button } from '@/ui/atoms/button/Button'
import { cn } from '@/ui/utils/style'
import { DepositCTAPanelProps } from '../DepositCTAPanel'

export interface ActionsProps {
  actions: DepositCTAPanelProps['actions']
  isInSandbox: boolean
  className?: string
}

export function Actions({ actions, isInSandbox, className }: ActionsProps) {
  if (isInSandbox) {
    return (
      <div className={cn('grid gap-4 lg:grid-cols-2', className)}>
        <Button variant="primary" size="l" className="lg:col-start-2" onClick={actions.primary.action}>
          {actions.primary.title}
        </Button>
      </div>
    )
  }
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      <Button variant="primary" size="l" onClick={actions.primary.action}>
        {actions.primary.title}
      </Button>
      <Button variant="secondary" size="l" onClick={actions.secondary.action} disabled={isInSandbox}>
        {actions.secondary.title}
      </Button>
    </div>
  )
}
