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

export function FullView({
  token,
  aToken,
  variableDebtTokenAddress,
  chainId,
  chainName,
  chainMismatch,
  marketOverview,
  walletOverview,
  openConnectModal,
  openDialog,
  oracleInfo,
}: MarketDetailsViewProps) {
  return (
    <div className="w-full max-w-5xl pt-12 pb-8 lg:mx-auto sm:mx-3">
      <BackNav />
      <Header
        token={token}
        aToken={aToken}
        variableDebtTokenAddress={variableDebtTokenAddress}
        chainName={chainName}
        chainMismatch={chainMismatch}
        chainId={chainId}
      />
      <div className="grid grid-cols-[2fr_1fr] gap-5 md:gap-10">
        <div className="flex flex-col gap-6">
          {marketOverview.supply && <SupplyStatusPanel token={token} {...marketOverview.supply} />}
          {marketOverview.lend && <LendStatusPanel {...marketOverview.lend} />}
          <CollateralStatusPanel {...marketOverview.collateral} />
          {marketOverview.eMode && <EModeStatusPanel {...marketOverview.eMode} />}
          <BorrowStatusPanel token={token} {...marketOverview.borrow} />
          <OraclePanel {...oracleInfo} />
        </div>
        <div className="flex flex-col gap-6">
          {(marketOverview.borrow.status === 'no' ? !marketOverview.summary.borrowed.isZero() : true) && (
            <MarketOverviewPanel token={token} {...marketOverview.summary} />
          )}
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
