import { formatPercentage } from '@/domain/common/format'
import { Farm } from '@/domain/farms/types'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { ApyTooltip } from '../../apy-tooltip/ApyTooltip'
import { DetailsItem } from '../common/DetailsItem'
import { GrowingReward } from './GrowingReward'

export interface ActiveFarmInfoPanelProps {
  farm: Farm
  openClaimDialog: () => void
  openUnstakeDialog: () => void
}

export function ActiveFarmInfoPanel({ farm, openClaimDialog, openUnstakeDialog }: ActiveFarmInfoPanelProps) {
  const { rewardToken, staked } = farm

  return (
    <Panel.Wrapper className="flex min-h-[380px] w-full flex-1 flex-col self-stretch px-6 py-6 md:px-[32px]">
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <h2 className="font-semibold text-lg md:text-xl">Overview</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" onClick={openClaimDialog} data-testid={testIds.farmDetails.activeFarmInfoPanel.claimButton}>
            Claim {rewardToken.symbol}
          </Button>
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
      <div className="flex flex-grow flex-col items-center justify-around">
        <GrowingReward farm={farm} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="hidden border-basics-border border-t md:block" />
        <div
          className={cn(
            'flex flex-col items-start gap-2 md:flex-row md:items-center',
            farm.apy.gt(0) ? 'w-full text-sm md:justify-between' : 'md:gap-12',
          )}
        >
          <DetailsItem title="Participants">
            <div className="font-semibold">{farm.depositors}</div>
          </DetailsItem>
          <DetailsItem title="TVL">
            <div className="font-semibold">{USD_MOCK_TOKEN.formatUSD(farm.totalSupply, { compact: true })}</div>
          </DetailsItem>
          {farm.apy.gt(0) && (
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
