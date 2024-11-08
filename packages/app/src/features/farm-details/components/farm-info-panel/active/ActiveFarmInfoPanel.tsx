import { getChainConfigEntry } from '@/config/chain'
import { farmAddresses, lastSepolia } from '@/config/chain/constants'
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
import { mainnet } from 'viem/chains'
import { ApyTooltip } from '../../apy-tooltip/ApyTooltip'
import { ChroniclePointsTooltip } from '../../chronicle-points-tooltip/ChroniclePointsTooltip'
import { DetailsItem } from '../common/DetailsItem'
import { GrowingReward } from './GrowingReward'
import { RewardPointsSyncWarning } from './RewardPointsSyncWarning'

export interface ActiveFarmInfoPanelProps {
  farm: Farm
  chainId: number
  canClaim: boolean
  calculateReward: (timestampInMs: number) => NormalizedUnitNumber
  refreshGrowingRewardIntervalInMs: number | undefined
  openClaimDialog: () => void
  openUnstakeDialog: () => void
  pointsSyncStatus?: RewardPointsSyncStatus
}

export function ActiveFarmInfoPanel({
  farm,
  chainId,
  canClaim,
  calculateReward,
  refreshGrowingRewardIntervalInMs,
  openClaimDialog,
  openUnstakeDialog,
  pointsSyncStatus,
}: ActiveFarmInfoPanelProps) {
  if (farm.rewardType === 'points') {
    assert(pointsSyncStatus, 'pointsSyncStatus should be defined')
  }

  const isChroniclePointsFarm =
    farm.address === farmAddresses[mainnet.id].chroniclePoints &&
    getChainConfigEntry(chainId).originChainId === lastSepolia.id

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
              Claim {farm.rewardToken.symbol}
            </Button>
          )}
          {farm.staked.gt(0) && (
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
        <div className="flex items-center gap-2 md:items-baseline">
          <GrowingReward
            rewardToken={farm.rewardToken}
            calculateReward={calculateReward}
            refreshIntervalInMs={refreshGrowingRewardIntervalInMs}
          />
          {isChroniclePointsFarm && <ChroniclePointsTooltip className="mt-2 md:mt-0" />}
        </div>
        {pointsSyncStatus && (
          <DelayedComponent>
            <RewardPointsSyncWarning
              status={pointsSyncStatus}
              data-testid={testIds.farmDetails.activeFarmInfoPanel.pointsSyncWarning}
            />
          </DelayedComponent>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="hidden border-basics-border border-t md:block" />
        <div
          className={cn(
            'flex flex-col items-start gap-2 md:flex-row md:items-center',
            farm.apy?.gt(0) ? 'w-full text-sm md:justify-between' : 'md:gap-12',
          )}
        >
          {farm.depositors && (
            <DetailsItem title="Participants">
              <div className="font-semibold">{farm.depositors}</div>
            </DetailsItem>
          )}

          <DetailsItem title="TVL">
            <div className="font-semibold">{USD_MOCK_TOKEN.formatUSD(farm.totalSupply, { compact: true })}</div>
          </DetailsItem>
          {farm.apy?.gt(0) && (
            <DetailsItem title="APY" explainer={<ApyTooltip farmAddress={farm.address} />}>
              <div className="font-semibold text-[#3F66EF]">
                {formatPercentage(farm.apy, { minimumFractionDigits: 0 })}
              </div>
            </DetailsItem>
          )}
          <DetailsItem title="My Deposit">
            <div className="font-semibold" data-testid={testIds.farmDetails.activeFarmInfoPanel.staked}>
              {farm.stakingToken.format(farm.staked, { style: 'auto' })} {farm.stakingToken.symbol}
            </div>
          </DetailsItem>
        </div>
      </div>
    </Panel.Wrapper>
  )
}
