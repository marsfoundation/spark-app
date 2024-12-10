import { Label } from '@/ui/atoms/label/Label'
import { Switch } from '@/ui/atoms/switch/Switch'
import { ComponentProps, useId } from 'react'

interface LabeledSwitchProps extends ComponentProps<typeof Switch> {
  'data-testid'?: string
}

export function LabeledSwitch({ children, 'data-testid': dataTestId, ...props }: LabeledSwitchProps) {
  const _id = useId()
  const id = props.id ?? _id

  return (
    <div className="flex items-center gap-3">
      <Switch {...props} id={id} data-testid={dataTestId} />
      <Label htmlFor={id} className="typography-label-2">
        {children}
      </Label>
    </div>
  )
}
