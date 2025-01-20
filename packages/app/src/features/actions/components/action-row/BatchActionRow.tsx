import { Button } from '@/ui/atoms/button/Button'
import { cn } from '@/ui/utils/style'
import { BatchActionHandler } from '../../logic/types'
import { ActionsGridLayout } from '../../types'
import { ErrorWarning } from './components/ErrorWarning'

export interface BatchActionRow {
  batchActionHandler: BatchActionHandler
  layout: ActionsGridLayout
}

export function BatchActionRow({ batchActionHandler, layout }: BatchActionRow) {
  return (
    <div
      className={cn('col-span-full grid grid-rows-[auto_auto] items-center gap-2 p-5', layout === 'compact' && 'p-4')}
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
      {batchActionHandler.state.status === 'error' && <ErrorWarning message={batchActionHandler.state.message} />}
    </div>
  )
}
