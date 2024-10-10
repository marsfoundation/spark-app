import { formatPercentage } from '@/domain/common/format'
import { AssetsGroup, Farm } from '@/domain/farms/types'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Button } from '@/ui/atoms/button/Button'
import { Link } from '@/ui/atoms/link/Link'
import { Panel } from '@/ui/atoms/panel/Panel'
import { links } from '@/ui/constants/links'
import { testIds } from '@/ui/utils/testIds'
import { ApyTooltip } from '../../apy-tooltip/ApyTooltip'
import { DetailsItem } from '../common/DetailsItem'

export interface InactiveFarmInfoPanelProps {
  assetsGroupType: AssetsGroup['type']
  farm: Farm
  hasTokensToDeposit: boolean
  walletConnected: boolean
  openStakeDialog: () => void
}

export function InactiveFarmInfoPanel({
  assetsGroupType,
  farm,
  hasTokensToDeposit,
  walletConnected,
  openStakeDialog,
}: InactiveFarmInfoPanelProps) {
  return (
    <Panel.Wrapper
      className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]"
      data-testid={testIds.farmDetails.infoPanel.panel}
    >
      <div className="flex max-w-[85%] flex-col gap-4">
        <h2 className="font-semibold text-2xl md:text-3xl">
          Deposit {assetsGroupToText(assetsGroupType)} <br />
          and earn{' '}
          <span className="text-[#3F66EF]">
            {/* @todo: Handle loading error states for farm api info nicer */}
            {farm.apiDetails.isPending
              ? ''
              : farm.apiDetails.data?.apy.gt(0)
                ? formatPercentage(farm.apiDetails?.data.apy, { minimumFractionDigits: 0 })
                : farm.blockchainDetails.rewardToken.symbol}
          </span>{' '}
          in rewards
        </h2>
        <div className="max-w-[75%] text-basics-dark-grey">
          {farm.apiDetails.data?.apy.gt(0) && (
            <>
              Deposit any of the tokens listed below and start farming {farm.blockchainDetails.rewardToken.symbol}{' '}
              tokens.
            </>
          )}{' '}
          Learn more about farming{' '}
          <Link to={links.docs.farmingRewards} external>
            here
          </Link>
          .
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-12">
          {farm.apiDetails.data && (
            <DetailsItem title="Participants">
              <div className="font-semibold">{farm.apiDetails.data.depositors}</div>
            </DetailsItem>
          )}
          <DetailsItem title="TVL">
            <div className="font-semibold">
              {USD_MOCK_TOKEN.formatUSD(farm.blockchainDetails.totalSupply, { compact: true })}
            </div>
          </DetailsItem>
          {farm.apiDetails.data ? (
            farm.blockchainDetails.rewardType === 'token' && farm.apiDetails.data.apy.gt(0) ? (
              <DetailsItem title="APY" explainer={<ApyTooltip farmAddress={farm.apiDetails.data.address} />}>
                <div className="font-semibold text-[#3F66EF]">
                  {formatPercentage(farm.apiDetails.data.apy, { minimumFractionDigits: 0 })}
                </div>
              </DetailsItem>
            ) : (
              <DetailsItem title="Total rewarded">
                <div className="font-semibold">
                  {farm.blockchainDetails.rewardToken.format(farm.apiDetails.data.totalRewarded, {
                    style: 'compact',
                    tokenUnitPriceOverride: farm.apiDetails.data.rewardTokenPriceUsd,
                  })}{' '}
                  {farm.blockchainDetails.rewardToken.symbol}
                </div>
              </DetailsItem>
            )
          ) : null}
        </div>
        <div className="hidden border-basics-border border-t md:block" />
        <Button
          className="w-full"
          disabled={!walletConnected || !hasTokensToDeposit}
          onClick={openStakeDialog}
          data-testid={testIds.farmDetails.infoPanel.stakeButton}
        >
          Deposit
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
