import { formatPercentage } from '@/domain/common/format'
import { Farm } from '@/domain/farms/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { RewardPointsSyncStatus } from '@/features/farm-details/types'
import { Button } from '@/ui/atoms/button/Button'
import { DelayedComponent } from '@/ui/atoms/delayed-component/DelayedComponent'
import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { assert } from '@/utils/assert'
import { ApyTooltip } from '../../apy-tooltip/ApyTooltip'
import { DetailsItem } from '../common/DetailsItem'
import { GrowingReward } from './GrowingReward'
import { RewardPointsSyncWarning } from './RewardPointsSyncWarning'

export interface ActiveFarmInfoPanelProps {
  farm: Farm
  canClaim: boolean
  calculateReward: (timestampInMs: number) => NormalizedUnitNumber
  refreshGrowingRewardIntervalInMs: number | undefined
  openClaimDialog: () => void
  openUnstakeDialog: () => void
  pointsSyncStatus?: RewardPointsSyncStatus
}

export function ActiveFarmInfoPanel({
  farm,
  canClaim,
  calculateReward,
  refreshGrowingRewardIntervalInMs,
  openClaimDialog,
  openUnstakeDialog,
  pointsSyncStatus,
}: ActiveFarmInfoPanelProps) {
  if (farm.blockchainDetails.rewardType === 'points') {
    assert(pointsSyncStatus, 'pointsSyncStatus should be defined')
  }
  const { rewardToken, staked, totalSupply, address, stakingToken } = farm.blockchainDetails

  return (
    <Panel.Wrapper className="flex min-h-[380px] w-full flex-1 flex-col self-stretch px-6 py-6 md:px-[32px]">
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <h2 className="font-semibold text-lg md:text-xl">Overview</h2>
        </div>
        <div className="flex items-center gap-1">
          {canClaim && (
            <Button
              size="sm"
              onClick={openClaimDialog}
              data-testid={testIds.farmDetails.activeFarmInfoPanel.claimButton}
            >
              Claim {rewardToken.symbol}
            </Button>
          )}
          {staked.gt(0) && (
            <Button
              size="sm"
              variant="secondary"
              onClick={openUnstakeDialog}
              data-testid={testIds.farmDetails.activeFarmInfoPanel.unstakeButton}
            >
              Withdraw
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-grow flex-col items-center justify-center gap-2">
        <GrowingReward
          rewardToken={rewardToken}
          rewardTokenPrice={farm.apiDetails.data?.rewardTokenPriceUsd}
          calculateReward={calculateReward}
          refreshIntervalInMs={refreshGrowingRewardIntervalInMs}
        />
        {pointsSyncStatus && (
          <DelayedComponent>
            <RewardPointsSyncWarning status={pointsSyncStatus} />
          </DelayedComponent>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="hidden border-basics-border border-t md:block" />
        <div
          className={cn(
            'flex flex-col items-start gap-2 md:flex-row md:items-center',
            farm.apiDetails.data?.apy.gt(0) ? 'w-full text-sm md:justify-between' : 'md:gap-12',
          )}
        >
          {farm.apiDetails.data && (
            <DetailsItem title="Participants">
              <div className="font-semibold">{farm.apiDetails.data.depositors}</div>
            </DetailsItem>
          )}

          <DetailsItem title="TVL">
            <div className="font-semibold">{USD_MOCK_TOKEN.formatUSD(totalSupply, { compact: true })}</div>
          </DetailsItem>
          {farm.apiDetails.data?.apy.gt(0) && (
            <DetailsItem title="APY" explainer={<ApyTooltip farmAddress={address} />}>
              <div className="font-semibold text-[#3F66EF]">
                {formatPercentage(farm.apiDetails.data.apy, { minimumFractionDigits: 0 })}
              </div>
            </DetailsItem>
          )}
          <DetailsItem title="My Deposit">
            <div className="font-semibold" data-testid={testIds.farmDetails.activeFarmInfoPanel.staked}>
              {stakingToken.format(staked, { style: 'auto' })} {stakingToken.symbol}
            </div>
          </DetailsItem>
        </div>
      </div>
    </Panel.Wrapper>
  )
}
