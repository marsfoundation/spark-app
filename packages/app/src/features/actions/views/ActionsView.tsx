import { cva } from 'class-variance-authority'

import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'

import { ActionsGrid } from '../components/actions-grid/ActionsGrid'
import { ActionHandler } from '../logic/types'
import { SettingsDialog } from '../settings-dialog/components/SettingsDialog'
import { UseSettingsDialogResult } from '../settings-dialog/logic/useSettingsDialog'

const actionsPanelVariants = cva('', {
  variants: {
    variant: {
      default: '',
      dialog: 'bg-panel-bg gap-0 p-4 md:p-4',
    },
  },
})

const actionsTitleVariants = cva('', {
  variants: {
    variant: {
      default: '',
      dialog: 'text-primary mb-1 font-semibold',
    },
  },
})

export interface ActionsViewProps {
  actionHandlers: ActionHandler[]
  settingsDisabled: boolean
  variant: 'default' | 'dialog'
  settingsDialogProps: UseSettingsDialogResult
}

export function ActionsView({ actionHandlers, variant, settingsDisabled, settingsDialogProps }: ActionsViewProps) {
  return (
    <Panel className={cn(actionsPanelVariants({ variant }))}>
      <Panel.Header className="justify-between">
        <Panel.Title
          variant={variant === 'dialog' ? 'prompt' : 'h3'}
          element="h3"
          className={actionsTitleVariants({ variant })}
        >
          Actions
        </Panel.Title>
        <SettingsDialog {...settingsDialogProps} disabled={settingsDisabled} />
      </Panel.Header>
      <Panel.Content className="flex flex-col gap-6">
        <ActionsGrid actionHandlers={actionHandlers} variant={variant === 'default' ? 'extended' : 'compact'} />
      </Panel.Content>
    </Panel>
  )
}
