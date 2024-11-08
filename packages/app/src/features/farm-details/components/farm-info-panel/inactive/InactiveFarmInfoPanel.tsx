import { getChainConfigEntry } from '@/config/chain'
import { farmAddresses, lastSepolia } from '@/config/chain/constants'
import { formatPercentage } from '@/domain/common/format'
import { AssetsGroup, Farm } from '@/domain/farms/types'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { Button } from '@/ui/atoms/button/Button'
import { Link } from '@/ui/atoms/link/Link'
import { Panel } from '@/ui/atoms/panel/Panel'
import { links } from '@/ui/constants/links'
import { testIds } from '@/ui/utils/testIds'
import { mainnet } from 'viem/chains'
import { ApyTooltip } from '../../apy-tooltip/ApyTooltip'
import { ChroniclePointsTooltip } from '../../chronicle-points-tooltip/ChroniclePointsTooltip'
import { DetailsItem } from '../common/DetailsItem'

export interface InactiveFarmInfoPanelProps {
  assetsGroupType: AssetsGroup['type']
  farm: Farm
  chainId: number
  hasTokensToDeposit: boolean
  walletConnected: boolean
  openStakeDialog: () => void
}

export function InactiveFarmInfoPanel({
  assetsGroupType,
  farm,
  chainId,
  hasTokensToDeposit,
  walletConnected,
  openStakeDialog,
}: InactiveFarmInfoPanelProps) {
  return (
    <Panel.Wrapper
      className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]"
      data-testid={testIds.farmDetails.infoPanel.panel}
    >
      {farm.rewardType === 'token' ? (
        <TokenFarmDetails farm={farm} assetsGroupType={assetsGroupType} />
      ) : (
        <PointsFarmDetails farm={farm} assetsGroupType={assetsGroupType} chainId={chainId} />
      )}
      <div className="flex flex-col gap-4">
        <div className="mt-6 flex flex-col items-start gap-1 md:mt-0 md:flex-row md:items-center md:gap-12">
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
          {farm.apy?.isZero() && farm.totalRewarded && (
            <DetailsItem title="Total rewarded">
              <div className="font-semibold">
                {farm.rewardToken.format(farm.totalRewarded, { style: 'compact' })} {farm.rewardToken.symbol}
              </div>
            </DetailsItem>
          )}
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

function PointsFarmDetails({
  farm,
  assetsGroupType,
  chainId,
}: { farm: Farm; assetsGroupType: AssetsGroup['type']; chainId: number }) {
  const isChroniclePointsFarm =
    farm.address === farmAddresses[mainnet.id].chroniclePoints &&
    getChainConfigEntry(chainId).originChainId === lastSepolia.id

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-2xl md:text-3xl">
        Deposit {assetsGroupToText(assetsGroupType)} <br />
        and earn <span className="text-[#3F66EF]">{farm.rewardToken.name}</span>{' '}
        <div className="inline-flex items-baseline gap-1">
          points
          {isChroniclePointsFarm && <ChroniclePointsTooltip />}
        </div>
      </h2>
      <div className=" text-basics-dark-grey text-sm">
        {isChroniclePointsFarm && (
          <div className="mb-2">
            Chronicle is the original oracle on Ethereum built within MakerDAO for the creation of DAI. Today,
            Chronicle's decentralized oracle network secures Sky, Spark, and many other DeFi and RWA protocols.
          </div>
        )}
        Learn more about farming{' '}
        <Link to={links.docs.farmingRewards} external>
          here
        </Link>
        .
      </div>
    </div>
  )
}

function TokenFarmDetails({ farm, assetsGroupType }: { farm: Farm; assetsGroupType: AssetsGroup['type'] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-2xl md:text-3xl">
        Deposit {assetsGroupToText(assetsGroupType)} <br />
        and earn{' '}
        <span className="text-[#3F66EF]">
          {farm.apy?.gt(0) ? formatPercentage(farm.apy, { minimumFractionDigits: 0 }) : farm.rewardToken.symbol}
        </span>{' '}
        in rewards
      </h2>
      <div className=" text-basics-dark-grey text-sm">
        {farm.apy?.gt(0) && (
          <>Deposit any of the tokens listed below and start farming {farm.rewardToken.symbol} tokens.</>
        )}{' '}
        Learn more about farming{' '}
        <Link to={links.docs.farmingRewards} external>
          here
        </Link>
        .
      </div>
    </div>
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
