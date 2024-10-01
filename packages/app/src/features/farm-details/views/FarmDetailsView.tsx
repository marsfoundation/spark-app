import { TokenWithBalance } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { Token } from '@/domain/types/Token'
import { getTokenImage } from '@/ui/assets'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { RewardsOverTime } from '../components/apr-over-time/RewardsOverTime'
import { BackNav } from '../components/back-nav/BackNav'
import { ActiveFarmInfoPanel } from '../components/farm-info-panel/active/ActiveFarmInfoPanel'
import { InactiveFarmInfoPanel } from '../components/farm-info-panel/inactive/InactiveFarmInfoPanel'
import { Header } from '../components/header/Header'
import { TokensToDeposit } from '../components/tokens-to-deposit/TokensToDeposit'
import { FarmHistoryQueryResult } from '../logic/historic/useFarmHistoryQuery'

export interface FarmDetailsViewProps {
  chainId: number
  chainMismatch: boolean
  walletConnected: boolean
  farm: Farm
  farmHistory: FarmHistoryQueryResult
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
  farmHistory,
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
          <RewardsOverTime farmHistory={farmHistory} farmAddress={farm.address} />
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
