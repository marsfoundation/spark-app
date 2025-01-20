import { ActionHandler } from '../../logic/types'
import { ActionsGridLayout } from '../../types'

export interface ActionRowBaseProps {
  actionIndex: number
  actionHandlerState: ActionHandler['state']
  onAction?: () => void
  layout: ActionsGridLayout
}
