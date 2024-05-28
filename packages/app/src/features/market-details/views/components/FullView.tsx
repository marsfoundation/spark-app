import { MarketOverview as MarketOverviewPanel } from '../../components/market-overview/MarketOverview'
import { MyWalletPanel } from '../../components/my-wallet/MyWalletPanel'
import { BorrowStatusPanel } from '../../components/status-panel/BorrowStatusPanel'
import { CollateralStatusPanel } from '../../components/status-panel/CollateralStatusPanel'
import { EModeStatusPanel } from '../../components/status-panel/EModeStatusPanel'
import { LendStatusPanel } from '../../components/status-panel/LendStatusPanel'
import { SupplyStatusPanel } from '../../components/status-panel/SupplyStatusPanel'
import { MarketDetailsViewProps } from '../types'
import { BackNav } from './BackNav'
import { Header } from './Header'

export function FullView({
  token,
  chainId,
  chainName,
  chainMismatch,
  marketOverview,
  walletOverview,
  openConnectModal,
  openDialog,
  airdropEligibleToken,
}: MarketDetailsViewProps) {
  return (
    <div className="w-full max-w-5xl pb-8 pt-12 sm:mx-3 lg:mx-auto">
      <BackNav chainId={chainId} chainName={chainName} />
      <Header token={token} chainName={chainName} chainMismatch={chainMismatch} />
      <div className="grid grid-cols-[2fr_1fr] gap-5 md:gap-10">
        <div className="flex flex-col gap-6">
          {marketOverview.supply && (
            <SupplyStatusPanel token={token} airdropEligibleToken={airdropEligibleToken} {...marketOverview.supply} />
          )}
          {marketOverview.lend && <LendStatusPanel {...marketOverview.lend} />}
          <CollateralStatusPanel {...marketOverview.collateral} />
          {marketOverview.eMode && <EModeStatusPanel {...marketOverview.eMode} />}
          <BorrowStatusPanel token={token} airdropEligibleToken={airdropEligibleToken} {...marketOverview.borrow} />
        </div>
        <div className="flex flex-col gap-6">
          <MarketOverviewPanel token={token} {...marketOverview.summary} />
          <MyWalletPanel
            openDialog={openDialog}
            walletOverview={walletOverview}
            openConnectModal={openConnectModal}
            chainMismatch={chainMismatch}
          />
        </div>
      </div>
    </div>
  )
}
