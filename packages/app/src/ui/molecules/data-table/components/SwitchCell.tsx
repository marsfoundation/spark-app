import { Switch } from '@/ui/atoms/switch/Switch'
import { MouseEventHandler } from 'react'
import { MobileViewOptions } from '../types'

interface SwitchCellProps {
  checked: boolean
  mobileViewOptions?: MobileViewOptions
  onSwitchClick: MouseEventHandler<HTMLButtonElement>
}

export function SwitchCell({ checked, onSwitchClick, mobileViewOptions }: SwitchCellProps) {
  if (mobileViewOptions?.isMobileView) {
    return (
      <div className="flex flex-row items-center justify-between">
        <div className="typography-label-6 w-full text-secondary">{mobileViewOptions.rowTitle}</div>
        <Switch checked={checked} onClick={onSwitchClick} />
      </div>
    )
  }

  return (
    <div className="flex w-full justify-end">
      <Switch checked={checked} onClick={onSwitchClick} />
    </div>
  )
}
