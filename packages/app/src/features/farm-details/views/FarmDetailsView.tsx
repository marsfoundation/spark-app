import { TokenWithBalance } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { Token } from '@/domain/types/Token'
import { getTokenImage } from '@/ui/assets'
import { ChartTabsPanel, createChartTab } from '@/ui/charts/components/ChartTabsPanel'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { BackNav } from '../components/back-nav/BackNav'
import { RewardsChart } from '../components/chart/rewards/RewardsChart'
import { TvlChart } from '../components/chart/tvl/TvlChart'
import { ActiveFarmInfoPanel } from '../components/farm-info-panel/active/ActiveFarmInfoPanel'
import { InactiveFarmInfoPanel } from '../components/farm-info-panel/inactive/InactiveFarmInfoPanel'
import { Header } from '../components/header/Header'
import { TokensToDeposit } from '../components/tokens-to-deposit/TokensToDeposit'
import { ChartDetails } from '../logic/useFarmDetails'

export interface FarmDetailsViewProps {
  chainId: number
  chainMismatch: boolean
  walletConnected: boolean
  farm: Farm
  chartDetails: ChartDetails
  tokensToDeposit: TokenWithBalance[]
  isFarmActive: boolean
  hasTokensToDeposit: boolean
  openStakeDialog: (token: Token) => void
  openDefaultedStakeDialog: () => void
  openClaimDialog: () => void
  openConnectModal: () => void
  openSandboxModal: () => void
  openUnstakeDialog: () => void
}

export function FarmDetailsView({
  chainId,
  chainMismatch,
  walletConnected,
  farm,
  chartDetails,
  tokensToDeposit,
  isFarmActive,
  hasTokensToDeposit,
  openStakeDialog,
  openDefaultedStakeDialog,
  openClaimDialog,
  openConnectModal,
  openSandboxModal,
  openUnstakeDialog,
}: FarmDetailsViewProps) {
  return (
    <div className="w-full max-w-5xl pt-12 pb-8 lg:mx-auto sm:mx-3">
      <BackNav chainId={chainId} />
      <Header token={farm.rewardToken} chainId={chainId} chainMismatch={chainMismatch} />
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
          {isFarmActive ? (
            <ActiveFarmInfoPanel farm={farm} openClaimDialog={openClaimDialog} openUnstakeDialog={openUnstakeDialog} />
          ) : (
            <InactiveFarmInfoPanel
              assetsGroupType={farm.entryAssetsGroup.type}
              farm={farm}
              walletConnected={walletConnected}
              hasTokensToDeposit={hasTokensToDeposit}
              openStakeDialog={openDefaultedStakeDialog}
            />
          )}
          <ChartTabsPanel
            tabs={[
              createChartTab({
                id: 'rewards',
                label: 'Rewards over time',
                component: RewardsChart,
                props: { data: chartDetails.farmHistory.data ?? [] },
              }),
              createChartTab({
                id: 'tvl',
                label: 'TVL',
                component: TvlChart,
                props: { data: chartDetails.farmHistory.data ?? [] },
              }),
            ]}
            selectedTimeframe={chartDetails.timeframe}
            onTimeframeChange={chartDetails.onTimeframeChange}
          />
        </div>
        {walletConnected && <TokensToDeposit assets={tokensToDeposit} openStakeDialog={openStakeDialog} />}
        {!walletConnected && (
          <ConnectOrSandboxCTAPanel
            header="Connect your wallet and start farming!"
            iconPaths={farm.entryAssetsGroup.assets.map((token) => getTokenImage(token))}
            action={openConnectModal}
            buttonText="Connect wallet"
            openSandboxModal={openSandboxModal}
          />
        )}
      </div>
    </div>
  )
}
