import { cva } from 'class-variance-authority'

import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'

import { Actions } from '../components/actions/Actions'
import { ActionHandler } from '../logic/types'
import { SettingsDialog } from '../settings-dialog/components/SettingsDialog'
import { UseSettingsDialogResult } from '../settings-dialog/logic/useSettingsDialog'

const actionsPanelVariants = cva('', {
  variants: {
    variant: {
      extended: '',
      compact: 'gap-0 bg-panel-bg p-4 md:p-4',
    },
  },
})

const actionsTitleVariants = cva('', {
  variants: {
    variant: {
      extended: '',
      compact: 'mb-1 font-semibold text-primary',
    },
  },
})

export type ActionsViewVariant = 'extended' | 'compact'

export interface ActionsViewProps {
  actionHandlers: ActionHandler[]
  settingsDisabled: boolean
  variant: ActionsViewVariant
  settingsDialogProps: UseSettingsDialogResult
}

export function ActionsView({ actionHandlers, variant, settingsDisabled, settingsDialogProps }: ActionsViewProps) {
  return (
    <Panel className={cn(actionsPanelVariants({ variant }))}>
      <Panel.Header className="justify-between">
        <Panel.Title
          variant={variant === 'compact' ? 'prompt' : 'h3'}
          element="h3"
          className={actionsTitleVariants({ variant })}
        >
          Actions
        </Panel.Title>
        <SettingsDialog {...settingsDialogProps} disabled={settingsDisabled} />
      </Panel.Header>
      <Panel.Content className="flex flex-col gap-6">
        <Actions actionHandlers={actionHandlers} variant={variant} />
      </Panel.Content>
    </Panel>
  )
}
