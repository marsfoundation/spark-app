import { ActionsContainer, ActionsContainerProps } from '@/features/actions/ActionsContainer'

export function DialogActionsPanel(props: Omit<Required<ActionsContainerProps>, 'variant'>) {
  return <ActionsContainer {...props} variant="dialog" />
}
