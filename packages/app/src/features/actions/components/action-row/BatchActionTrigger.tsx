import { Button } from '@/ui/atoms/button/Button'
import { cn } from '@/ui/utils/style'
import { BatchActionHandler } from '../../logic/types'
import { ActionsGridLayout } from '../../types'
import { ErrorWarning } from './components/ErrorWarning'

export interface BatchActionTrigger {
  batchActionHandler: BatchActionHandler
  actionsGridLayout: ActionsGridLayout
}

export function BatchActionTrigger({ batchActionHandler, actionsGridLayout }: BatchActionTrigger) {
  return (
    <div
      className={cn(
        'grid w-full grid-rows-[auto_auto] items-center border-t p-5',
        actionsGridLayout === 'compact' && 'p-4',
      )}
    >
      <Button
        variant="primary"
        size="l"
        onClick={batchActionHandler.onAction}
        loading={batchActionHandler.state.status === 'loading'}
        disabled={batchActionHandler.state.status === 'disabled'}
        className="w-full"
      >
        {batchActionHandler.state.status === 'error' ? 'Try Again' : 'Execute'}
      </Button>
      {batchActionHandler.state.status === 'error' && (
        <ErrorWarning message={batchActionHandler.state.message} className="mt-2" withPrefixIcon />
      )}
    </div>
  )
}
