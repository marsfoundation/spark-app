import { ComponentProps, useId } from 'react'

import { Label } from '@/ui/atoms/label/Label'
import { Switch } from '@/ui/atoms/switch/Switch'

interface LabeledSwitchProps extends ComponentProps<typeof Switch> {}

export function LabeledSwitch({ children, ...props }: LabeledSwitchProps) {
  const _id = useId()
  const id = props.id ?? _id

  return (
    <div className="flex items-center gap-3">
      <Switch {...props} id={id} />
      <Label htmlFor={id} className="font-normal text-base">
        {children}
      </Label>
    </div>
  )
}
