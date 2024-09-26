import { Farm } from '@/domain/farms/types'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { Info } from '@/ui/molecules/info/Info'
import { testIds } from '@/ui/utils/testIds'
import { FarmStatsRow } from '../farm-stats-row/FarmStatsRow'
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
          <Info>Info about your balance in the farm</Info>
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
        <FarmStatsRow
          apy={farm.apy}
          depositors={farm.depositors}
          tvl={farm.totalSupply}
          deposit={{ token: farm.stakingToken, value: farm.staked }}
        />
      </div>
    </Panel.Wrapper>
  )
}
