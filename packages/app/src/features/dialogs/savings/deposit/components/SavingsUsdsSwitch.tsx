import { assets } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { Switch } from '@/ui/atoms/switch/Switch'
import { testIds } from '@/ui/utils/testIds'
import { ChevronDown } from 'lucide-react'

export interface SavingsUsdsSwitchProps {
  checked: boolean
  onSwitch: () => void
}

export function SavingsUsdsSwitch({ checked, onSwitch }: SavingsUsdsSwitchProps) {
  return (
    <div className="flex">
      <div className="flex w-full items-center justify-between rounded-xl rounded-r-none border border-basics-green/50 bg-basics-green/5 p-4">
        <div className="flex items-center gap-3">
          <img src={assets.token.susds} className="h-5" />
          <div>
            Deposit into <span className="text-basics-green">Savings USDS</span> to get more!
          </div>
        </div>
        <Switch checked={checked} onClick={onSwitch} data-testid={testIds.dialog.savings.upgradeSwitch} />
      </div>
      <div className="flex items-center justify-between rounded-xl rounded-l-none border border-basics-green/50 border-l-0 bg-basics-green/5">
        <Button variant="icon">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
