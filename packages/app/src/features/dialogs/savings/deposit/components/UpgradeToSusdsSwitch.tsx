import { formatPercentage } from '@/domain/common/format'
import { assets } from '@/ui/assets'
import { Switch } from '@/ui/atoms/switch/Switch'
import { testIds } from '@/ui/utils/testIds'
import { PortalRef } from '@/ui/utils/usePortalRef'
import { Percentage } from '@marsfoundation/common-universal'
import { BenefitsDialog } from './BenefitsDialog'

export interface UpgradeToSusdsSwitchProps {
  checked: boolean
  onSwitch: () => void
  benefitsDialogPortalContainerRef?: PortalRef
  apyImprovement?: Percentage
}

export function UpgradeToSusdsSwitch({
  checked,
  onSwitch,
  benefitsDialogPortalContainerRef,
  apyImprovement,
}: UpgradeToSusdsSwitchProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-sm bg-savings-100 px-4 py-5">
      <div className="flex items-center gap-2">
        <img src={assets.token.susds} className="h-5" />
        <div className="typography-label-2 text-primary">
          Deposit into Savings USDS and get{' '}
          {apyImprovement ? (
            <span className="text-savings-600">{formatPercentage(apyImprovement)} higher APY</span>
          ) : (
            'more!'
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <Switch checked={checked} onClick={onSwitch} data-testid={testIds.dialog.savings.upgradeSwitch} />
        <BenefitsDialog portalContainerRef={benefitsDialogPortalContainerRef} apyImprovement={apyImprovement} />
      </div>
    </div>
  )
}
