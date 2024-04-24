import { eModeCategoryIdToName } from '@/domain/e-mode/constants'
import { EModeCategoryId } from '@/domain/e-mode/types'
import { Switch } from '@/ui/atoms/switch/Switch'
import { Info } from '@/ui/molecules/info/Info'

interface EModeSwitchProps {
  eModeCategoryId: EModeCategoryId
  onSwitchClick: () => void
}

export function EModeSwitch({ eModeCategoryId, onSwitchClick }: EModeSwitchProps) {
  return (
    <div className="ml-4 mt-1.5 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-row items-center gap-0.5">
        <p className="text-basics-dark-grey text-xs">E-Mode</p>
        <Info>Efficiency mode (E-Mode) increases your LTV for a selected category of assets up to 97%.</Info>
      </div>
      <Switch checked={eModeCategoryId !== 0} onClick={onSwitchClick} />
      <p className="text-basics-dark-grey text-xs font-semibold">
        {eModeCategoryId !== 0 && eModeCategoryIdToName[eModeCategoryId]}
      </p>
    </div>
  )
}
