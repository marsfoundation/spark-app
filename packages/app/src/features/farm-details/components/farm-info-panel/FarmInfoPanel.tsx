import { formatPercentage } from '@/domain/common/format'
import { AssetsGroup, FarmDetailsRowData } from '@/domain/farms/types'
import { Token } from '@/domain/types/Token'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { testIds } from '@/ui/utils/testIds'
import { FarmDetailsRow } from '../farm-details-row/FarmDetailsRow'

export interface FarmInfoPanelProps {
  assetsGroupType: AssetsGroup['type']
  rewardToken: Token
  farmDetailsRowData: FarmDetailsRowData
  hasTokensToDeposit: boolean
  walletConnected: boolean
  openStakeDialog: () => void
}

export function FarmInfoPanel({
  assetsGroupType,
  rewardToken,
  farmDetailsRowData,
  hasTokensToDeposit,
  walletConnected,
  openStakeDialog,
}: FarmInfoPanelProps) {
  return (
    <Panel.Wrapper className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]">
      <div className="flex max-w-[75%] flex-col gap-4">
        <h2 className="font-semibold text-2xl md:text-3xl">
          Stake {assetsGroupToText(assetsGroupType)} <br />
          and earn{' '}
          <span className="text-[#3F66EF]">
            {formatPercentage(farmDetailsRowData.apy, { minimumFractionDigits: 0 })}
          </span>{' '}
          APY
        </h2>
        <div className="text-basics-dark-grey">
          Deposit the {assetsGroupToText(assetsGroupType)} from those available below and start farming{' '}
          {rewardToken.symbol} token.
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <FarmDetailsRow farmDetailsRowData={farmDetailsRowData} />
        <div className="hidden border-basics-border border-t md:block" />
        <Button
          className="w-full"
          disabled={!walletConnected || !hasTokensToDeposit}
          onClick={openStakeDialog}
          data-testid={testIds.farmDetails.infoPanel.stakeButton}
        >
          Stake
        </Button>
      </div>
    </Panel.Wrapper>
  )
}

function assetsGroupToText(assetsGroupType: AssetsGroup['type']): string {
  switch (assetsGroupType) {
    case 'stablecoins':
      return 'stablecoins'
    case 'governance':
      return 'governance tokens'
  }
}
