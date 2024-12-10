import { TokenWithValue } from '@/domain/common/types'
import { getTokenImage } from '@/ui/assets'
import { Switch } from '@/ui/atoms/switch/Switch'
import { testIds } from '@/ui/utils/testIds'
import { cva } from 'class-variance-authority'

export interface UpgradeToSusdsSwitchProps {
  checked: boolean
  onSwitch: () => void
  reward: TokenWithValue
}

export function ExitFarmSwitch({ checked, onSwitch, reward }: UpgradeToSusdsSwitchProps) {
  const rewardIcon = getTokenImage(reward.token.symbol)
  const rewardAmount = reward.token.format(reward.value, { style: 'auto' })
  const rewardUsdValue = reward.token.formatUSD(reward.value)

  return (
    <div className={variants({ checked })}>
      <div className="flex items-center gap-3">
        <img src={rewardIcon} className="h-6" />
        <div className="flex flex-col">
          <div className="typography-label-2 text-primary">
            Withdraw and claim<span className="hidden sm:inline"> rewards in one transaction</span>
          </div>
          <div
            className="typography-label-4 text-secondary"
            data-testid={testIds.farmDetails.unstakeDialog.exitFarmSwitchPanel.reward}
          >
            ~{rewardAmount} {reward.token.symbol} {reward.token.unitPriceUsd.gt(0) && `(~${rewardUsdValue})`}
          </div>
        </div>
      </div>
      <Switch
        checked={checked}
        onClick={onSwitch}
        data-testid={testIds.farmDetails.unstakeDialog.exitFarmSwitchPanel.switch}
      />
    </div>
  )
}

const variants = cva('flex w-full items-center justify-between rounded-sm px-4 py-3', {
  variants: {
    checked: {
      true: 'bg-savings-100',
      false: 'bg-secondary',
    },
  },
})
