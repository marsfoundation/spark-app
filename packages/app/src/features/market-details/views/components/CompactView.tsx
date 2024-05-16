import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/atoms/tabs/Tabs'

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

export function CompactView({
  token,
  chainName,
  chainId,
  chainMismatch,
  marketOverview,
  walletOverview,
  airdropTokenSymbol,
  openConnectModal,
  openDialog,
}: MarketDetailsViewProps) {
  return (
    <div className="w-full pb-8 pt-5">
      <BackNav chainId={chainId} chainName={chainName} />
      <Header token={token} chainName={chainName} chainMismatch={chainMismatch} />
      <Tabs defaultValue="overview">
        <TabsList className="bg-body sticky top-0 z-10 pt-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex flex-col gap-4 px-3">
          <MarketOverviewPanel token={token} {...marketOverview.summary} />
          {marketOverview.supply && (
            <SupplyStatusPanel token={token} airdropTokenSymbol={airdropTokenSymbol} {...marketOverview.supply} />
          )}
          {marketOverview.lend && <LendStatusPanel {...marketOverview.lend} />}
          <CollateralStatusPanel {...marketOverview.collateral} />
          {marketOverview.eMode && <EModeStatusPanel {...marketOverview.eMode} />}
          <BorrowStatusPanel token={token} airdropTokenSymbol={airdropTokenSymbol} {...marketOverview.borrow} />
        </TabsContent>
        <TabsContent value="actions" className="px-3">
          <MyWalletPanel
            openDialog={openDialog}
            walletOverview={walletOverview}
            openConnectModal={openConnectModal}
            chainMismatch={chainMismatch}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
