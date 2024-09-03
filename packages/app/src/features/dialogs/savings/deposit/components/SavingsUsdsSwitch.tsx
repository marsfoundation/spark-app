import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { Switch } from '@/ui/atoms/switch/Switch'
import { testIds } from '@/ui/utils/testIds'
import { BenefitsDialog } from './BenefitsDialog'

export interface SavingsUsdsSwitchProps {
  checked: boolean
  onSwitch: () => void
  benefitsDialogPortalContainer?: HTMLElement | null
  apyImprovement?: Percentage
}

export function SavingsUsdsSwitch({
  checked,
  onSwitch,
  benefitsDialogPortalContainer,
  apyImprovement,
}: SavingsUsdsSwitchProps) {
  return (
    <div className="flex">
      <div className="flex w-full items-center justify-between rounded-xl rounded-r-none border border-basics-green/50 bg-basics-green/5 p-4">
        <div className="flex items-center gap-2">
          <img src={assets.token.susds} className="h-5" />
          <div className="text-sm">
            Deposit into Savings USDC and get{' '}
            {apyImprovement ? (
              <span className="text-basics-green">{formatPercentage(apyImprovement)} higher APY</span>
            ) : (
              'more!'
            )}
          </div>
        </div>
        <Switch checked={checked} onClick={onSwitch} data-testid={testIds.dialog.savings.upgradeSwitch} />
      </div>
      <div className="flex items-center justify-between rounded-xl rounded-l-none border border-basics-green/50 border-l-0 bg-basics-green/5">
        <BenefitsDialog portalContainer={benefitsDialogPortalContainer} apyImprovement={apyImprovement} />
      </div>
    </div>
  )
}
