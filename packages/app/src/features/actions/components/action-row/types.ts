import { ActionHandler } from '../../logic/types'

export type ActionRowVariant = 'extended' | 'compact'

export interface ActionRowBaseProps {
  index: number
  actionHandlerState: ActionHandler['state']
  onAction: ActionHandler['onAction']
  variant: ActionRowVariant
}
