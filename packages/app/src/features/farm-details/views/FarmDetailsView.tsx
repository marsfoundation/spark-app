import { TokenWithBalance } from '@/domain/common/types'
import { Farm, FarmDetailsRowData } from '@/domain/farms/types'
import { Token } from '@/domain/types/Token'
import { getTokenImage } from '@/ui/assets'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { ActiveFarmInfoPanel } from '../components/active-farm-info-panel/ActiveFarmInfoPanel'
import { AprOverTime } from '../components/apr-over-time/AprOverTime'
import { BackNav } from '../components/back-nav/BackNav'
import { FarmInfoPanel } from '../components/farm-info-panel/FarmInfoPanel'
import { Header } from '../components/header/Header'
import { TokensToDeposit } from '../components/tokens-to-deposit/TokensToDeposit'
import { FarmHistoryItem } from '../logic/historic/types'

export interface FarmDetailsViewProps {
  chainId: number
  chainMismatch: boolean
  walletConnected: boolean
  farm: Farm
  farmDetailsRowData: FarmDetailsRowData
  farmHistoricData: FarmHistoryItem[]
  tokensToDeposit: TokenWithBalance[]
  hasTokensToDeposit: boolean
  openStakeDialog: (token: Token) => void
  openDefaultedStakeDialog: () => void
  openClaimDialog: () => void
  openConnectModal: () => void
  openSandboxModal: () => void
}

export function FarmDetailsView({
  chainId,
  chainMismatch,
  walletConnected,
  farm,
  farmDetailsRowData,
  farmHistoricData,
  tokensToDeposit,
  hasTokensToDeposit,
  openStakeDialog,
  openDefaultedStakeDialog,
  openClaimDialog,
  openConnectModal,
  openSandboxModal,
}: FarmDetailsViewProps) {
  return (
    <div className="w-full max-w-5xl pt-12 pb-8 lg:mx-auto sm:mx-3">
      <BackNav chainId={chainId} />
      <Header token={farm.rewardToken} chainId={chainId} chainMismatch={chainMismatch} />
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
          {farm.staked.gt(0) && (
            <ActiveFarmInfoPanel
              farm={farm}
              farmDetailsRowData={farmDetailsRowData}
              openClaimDialog={openClaimDialog}
            />
          )}
          {farm.staked.eq(0) && (
            <FarmInfoPanel
              assetsGroupType={farm.entryAssetsGroup.type}
              rewardToken={farm.rewardToken}
              farmDetailsRowData={farmDetailsRowData}
              walletConnected={walletConnected}
              hasTokensToDeposit={hasTokensToDeposit}
              openStakeDialog={openDefaultedStakeDialog}
            />
          )}
          <AprOverTime data={farmHistoricData} />
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
