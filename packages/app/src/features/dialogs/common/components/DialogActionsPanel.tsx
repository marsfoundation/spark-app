import { ActionsContainer } from '@/features/actions/ActionsContainer'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'

export interface DialogActionsPanelProps {
  objectives: Objective[]
  onFinish: () => void
  enabled: boolean
  context?: InjectedActionsContext
}

export function DialogActionsPanel(props: DialogActionsPanelProps) {
  return <ActionsContainer {...props} variant="dialog" />
}
