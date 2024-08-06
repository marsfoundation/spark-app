import { assets } from '@/ui/assets'
import { Switch } from '@/ui/atoms/switch/Switch'
import { testIds } from '@/ui/utils/testIds'

export interface SavingsNSTSwitchProps {
  checked: boolean
  onSwitch: () => void
}

export function SavingsNSTSwitch({ checked, onSwitch }: SavingsNSTSwitchProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-basics-green/50 bg-basics-green/5 p-4">
      <div className="flex items-center gap-3">
        <img src={assets.rocket} />
        <div>
          Deposit into <span className="text-basics-green">Savings NST</span> and get more benefits!
        </div>
      </div>
      <Switch checked={checked} onClick={onSwitch} data-testid={testIds.dialog.savings.upgradeSwitch} />
    </div>
  )
}
