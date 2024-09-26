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
          <div className="font-medium text-sm">
            Withdraw and claim<span className="hidden sm:inline"> rewards in one transaction</span>
          </div>
          <div
            className="text-basics-dark-grey text-xs"
            data-testid={testIds.farmDetails.unstakeDialog.exitFarmSwitchPanel.reward}
          >
            ~{rewardAmount} {reward.token.symbol} (~{rewardUsdValue})
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

const variants = cva('flex w-full items-center justify-between rounded-xl border px-4 py-3', {
  variants: {
    checked: {
      true: 'border-basics-green/50 bg-basics-green/5',
      false: 'border-basics-border bg-panel-bg',
    },
  },
})
