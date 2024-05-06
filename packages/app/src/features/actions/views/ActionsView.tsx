import { cva } from 'class-variance-authority'
import { Fuel } from 'lucide-react'

import { ActionsSettings } from '@/domain/state/actions-settings'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Panel } from '@/ui/atoms/panel/Panel'
import { Info } from '@/ui/molecules/info/Info'
import { LabeledSwitch } from '@/ui/molecules/labeled-switch/LabeledSwitch'
import { cn } from '@/ui/utils/style'

import { ActionsGrid } from '../components/actions-grid/ActionsGrid'
import { ActionHandler } from '../logic/types'
import { SettingsDialog } from '../settings-dialog/components/SettingsDialog'
import { UseSettingsDialogResult } from '../settings-dialog/logic/useSettingsDialog'
import { formatGasPrice } from '../utils/formatGasPrice'

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
  actionsSettings: ActionsSettings
  settingsDisabled: boolean
  variant: 'default' | 'dialog'
  gasPrice?: NormalizedUnitNumber
  settingsDialogProps: UseSettingsDialogResult
}

export function ActionsView({
  actionHandlers,
  actionsSettings,
  variant,
  gasPrice,
  settingsDisabled,
  settingsDialogProps,
}: ActionsViewProps) {
  const { preferPermits, setPreferPermits } = actionsSettings

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
        {import.meta.env.VITE_DEV_ACTIONS_SETTINGS === '1' && <SettingsDialog {...settingsDialogProps} />}
      </Panel.Header>
      <Panel.Content className="flex flex-col gap-6">
        <ActionsGrid actionHandlers={actionHandlers} variant={variant === 'default' ? 'extended' : 'compact'} />
        <div className="flex flex-row justify-between">
          <LabeledSwitch onCheckedChange={setPreferPermits} checked={preferPermits} disabled={settingsDisabled}>
            <div className="flex flex-row items-center gap-1">
              <div>Prefer permits</div>
              <Info>
                Use permits for actions that support them. Permits are a way to save gas by allowing a contract to
                execute multiple actions in a single transaction.
              </Info>
            </div>
          </LabeledSwitch>
          <div className="text-basics-dark-grey hidden items-center justify-end gap-2 md:flex">
            <Fuel className="ml-2 h-5" />
            {gasPrice ? `~${formatGasPrice(gasPrice)} GWEI` : 'Not available'}
          </div>
        </div>
      </Panel.Content>
    </Panel>
  )
}
