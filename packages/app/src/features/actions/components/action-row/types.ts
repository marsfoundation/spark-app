import { ActionHandler, BatchActionHandler } from '../../logic/types'
import { ActionsGridLayout } from '../../types'

export interface ActionRowBaseProps {
  actionIndex: number
  actionHandlerState: ActionHandler['state'] | BatchActionHandler['state']
  onAction: () => void
  layout: ActionsGridLayout
}
