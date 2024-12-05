import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/atoms/tabs/Tabs'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { MarketOverview as MarketOverviewPanel } from '../../components/market-overview/MarketOverview'
import { MyWalletPanel } from '../../components/my-wallet/MyWalletPanel'
import { OraclePanel } from '../../components/oracle-panel/OraclePanel'
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
  aToken,
  variableDebtTokenAddress,
  chainName,
  chainId,
  chainMismatch,
  marketOverview,
  walletOverview,
  openConnectModal,
  openSandboxModal,
  openDialog,
  oracleInfo,
}: MarketDetailsViewProps) {
  return (
    <PageLayout className="gap-0">
      <BackNav chainId={chainId} />
      <Header
        token={token}
        aToken={aToken}
        variableDebtTokenAddress={variableDebtTokenAddress}
        chainName={chainName}
        chainMismatch={chainMismatch}
        chainId={chainId}
      />
      <Tabs defaultValue="overview">
        <TabsList className="bg-body pt-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex flex-col gap-4">
          {(marketOverview.borrow.status === 'no' ? !marketOverview.summary.borrowed.isZero() : true) && (
            <MarketOverviewPanel token={token} {...marketOverview.summary} />
          )}
          {marketOverview.supply && <SupplyStatusPanel token={token} {...marketOverview.supply} />}
          {marketOverview.lend && <LendStatusPanel {...marketOverview.lend} />}
          <CollateralStatusPanel {...marketOverview.collateral} />
          {marketOverview.eMode && <EModeStatusPanel {...marketOverview.eMode} />}
          <BorrowStatusPanel token={token} {...marketOverview.borrow} />
          <OraclePanel {...oracleInfo} />
        </TabsContent>
        <TabsContent value="actions" className="px-3">
          <MyWalletPanel
            openSandboxModal={openSandboxModal}
            openDialog={openDialog}
            walletOverview={walletOverview}
            openConnectModal={openConnectModal}
            chainMismatch={chainMismatch}
          />
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}
