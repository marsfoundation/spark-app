import { TokenWithBalance } from '@/domain/common/types'
import { UseSavingsChartsInfoQueryResult } from '@/domain/savings-charts/useSavingsChartsInfoQuery'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { savingsDepositDialogConfig } from '@/features/dialogs/savings/deposit/SavingsDepositDialog'
import { savingsWithdrawDialogConfig } from '@/features/dialogs/savings/withdraw/SavingsWithdrawDialog'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { PageHeader } from '../components/PageHeader'
import { AccountMainPanelGroup } from '../components/account-main-panel-group/AccountMainPanelGroup'
import { DepositCTAPanel } from '../components/deposit-cta-panel/DepositCTAPanel'
import { EntryAssetsPanel } from '../components/entry-assets-panel/EntryAssetsPanel'
import { UpgradeSavingsBanner } from '../components/new-upgrade-savings-baner/UpgradeSavingsBanner'
import { SavingsCharts } from '../components/savings-charts/SavingsCharts'
import { MigrationInfo } from '../logic/makeMigrationInfo'
import { SavingsAccountEntryAssets, SavingsTokenDetails } from '../logic/useSavings'

export interface SavingsAccountViewProps {
  savingsTokenDetails: SavingsTokenDetails
  entryAssets: SavingsAccountEntryAssets[]
  mostValuableAsset: TokenWithBalance
  assetsConvertSupported: boolean
  savingsChartsInfo: UseSavingsChartsInfoQueryResult
  // @todo: Pass separate functions for each dialog after removing old views
  openDialog: OpenDialogFunction
  openSandboxModal: () => void
  openConnectModal: () => void
  guestMode: boolean
  migrationInfo?: MigrationInfo
}

export function SavingsAccountView({
  savingsTokenDetails,
  entryAssets,
  mostValuableAsset,
  assetsConvertSupported,
  savingsChartsInfo,
  openDialog,
  openSandboxModal,
  openConnectModal,
  guestMode,
  migrationInfo,
}: SavingsAccountViewProps) {
  const displayDepositCallToAction = guestMode || savingsTokenDetails.savingsTokenWithBalance.balance.eq(0)
  const displaySavingsChart = savingsChartsInfo.chartsSupported
  const displayUpgradeSavingsBanner =
    migrationInfo?.sdaiToSusdsUpgradeAvailable && savingsTokenDetails.underlyingToken.symbol === migrationInfo.daiSymbol

  const primaryAction = guestMode
    ? { title: 'Connect Wallet' as const, action: openConnectModal }
    : {
        title: 'Deposit' as const,
        action: () => openDialog(savingsDepositDialogConfig, { initialToken: mostValuableAsset.token }),
      }

  return (
    <PageLayout>
      <PageHeader />
      <div className="flex flex-col gap-6">
        {displayDepositCallToAction ? (
          <DepositCTAPanel
            savingsRate={savingsTokenDetails.APY}
            entryTokens={entryAssets.map((asset) => asset.token)}
            savingsToken={savingsTokenDetails.savingsTokenWithBalance.token}
            // @todo: get description from chain config when available
            description={{
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              docsLink: '',
            }}
            actions={{
              primary: primaryAction,
              secondary: { title: 'Try in Sandbox', action: openSandboxModal },
            }}
          />
        ) : (
          <AccountMainPanelGroup
            underlyingToken={savingsTokenDetails.underlyingToken}
            savingsToken={savingsTokenDetails.savingsTokenWithBalance.token}
            savingsTokenBalance={savingsTokenDetails.savingsTokenWithBalance.balance}
            calculateUnderlyingTokenBalance={savingsTokenDetails.calculateSavingsBalance}
            balanceRefreshIntervalInMs={savingsTokenDetails.balanceRefreshIntervalInMs}
            openDepositDialog={() => openDialog(savingsDepositDialogConfig, { initialToken: mostValuableAsset.token })}
            openSendDialog={() =>
              openDialog(savingsWithdrawDialogConfig, {
                mode: 'send',
                savingsToken: savingsTokenDetails.savingsTokenWithBalance.token,
                underlyingToken: savingsTokenDetails.underlyingToken,
              } as const)
            }
            openWithdrawDialog={() =>
              openDialog(savingsWithdrawDialogConfig, {
                mode: 'withdraw',
                savingsToken: savingsTokenDetails.savingsTokenWithBalance.token,
                underlyingToken: savingsTokenDetails.underlyingToken,
              } as const)
            }
            projections={savingsTokenDetails.currentProjections}
          />
        )}
        {displayUpgradeSavingsBanner && (
          <UpgradeSavingsBanner
            onUpgradeSavingsClick={migrationInfo.openSDaiToSUsdsUpgradeDialog}
            apyImprovement={migrationInfo.apyImprovement}
          />
        )}
        {displaySavingsChart && (
          <SavingsCharts
            savingsTokenSymbol={savingsTokenDetails.savingsTokenWithBalance.token.symbol}
            {...savingsChartsInfo}
          />
        )}
      </div>
      <EntryAssetsPanel
        assets={entryAssets}
        openDialog={openDialog}
        showConvertDialogButton={assetsConvertSupported}
        migrationInfo={migrationInfo}
      />
    </PageLayout>
  )
}
