import { Farm, FarmDetailsRowData } from '@/domain/farms/types'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { Info } from '@/ui/molecules/info/Info'
import { testIds } from '@/ui/utils/testIds'
import { FarmDetailsRow } from '../farm-details-row/FarmDetailsRow'
import { EarnedBalance } from './EarnedBalance'

export interface ActiveFarmInfoPanelProps {
  farmDetailsRowData: FarmDetailsRowData
  farm: Farm
  openClaimDialog: () => void
}

export function ActiveFarmInfoPanel({ farmDetailsRowData, farm, openClaimDialog }: ActiveFarmInfoPanelProps) {
  const { rewardToken, stakingToken, staked } = farm

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
          <Button size="sm" variant="secondary">
            Withdraw {stakingToken.symbol}
          </Button>
        </div>
      </div>
      <div className="flex flex-grow flex-col items-center justify-around">
        <div className="flex flex-col items-center gap-1">
          <EarnedBalance farm={farm} />
          <div className="font-semibold text-basics-dark-grey text-xs tracking-wide">
            =
            <span data-testid={testIds.farmDetails.activeFarmInfoPanel.staked}>
              {stakingToken.format(staked, { style: 'auto' })} {stakingToken.symbol}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="hidden border-basics-border border-t md:block" />
        <FarmDetailsRow farmDetailsRowData={farmDetailsRowData} />
      </div>
    </Panel.Wrapper>
  )
}
