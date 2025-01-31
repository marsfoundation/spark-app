import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { savingsDepositDialogConfig } from '@/features/dialogs/savings/deposit/SavingsDepositDialog'
import { savingsWithdrawDialogConfig } from '@/features/dialogs/savings/withdraw/SavingsWithdrawDialog'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { cn } from '@/ui/utils/style'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { PageHeader } from '../components/PageHeader'
import { AccountMainPanelGroup } from '../components/account-main-panel-group/AccountMainPanelGroup'
import { AccountsNavigation } from '../components/accounts-navigation/AccountsNavigation'
import { DepositCTAPanel } from '../components/deposit-cta-panel/DepositCTAPanel'
import { EntryAssetsPanel } from '../components/entry-assets-panel/EntryAssetsPanel'
import { SavingsCharts } from '../components/savings-charts/SavingsCharts'
import { UpgradeSavingsBanner } from '../components/upgrade-savings-baner/UpgradeSavingsBanner'
import { MigrationInfo } from '../logic/makeMigrationInfo'
import { ChartsData, InterestData, SavingsAccountEntryAssets, ShortAccountDefinition } from '../logic/useSavings'

export interface SavingsAccountViewProps {
  savingsToken: Token
  savingsTokenBalance: NormalizedUnitNumber
  underlyingToken: Token
  interestData: InterestData
  entryAssets: SavingsAccountEntryAssets[]
  mostValuableAsset: TokenWithBalance
  showConvertDialogButton: boolean
  chartsData: ChartsData
  // @todo: Pass separate functions for each dialog after removing old views
  openDialog: OpenDialogFunction
  openSandboxModal: () => void
  openConnectModal: () => void
  guestMode: boolean
  migrationInfo?: MigrationInfo
  allAccounts: ShortAccountDefinition[]
  setSelectedAccount: (savingsTokenSymbol: TokenSymbol) => void
}

export function SavingsAccountView({
  savingsToken,
  savingsTokenBalance,
  underlyingToken,
  interestData,
  entryAssets,
  mostValuableAsset,
  showConvertDialogButton,
  chartsData,
  openDialog,
  openSandboxModal,
  openConnectModal,
  guestMode,
  migrationInfo,
  setSelectedAccount,
  allAccounts,
}: SavingsAccountViewProps) {
  const displayDepositCallToAction = guestMode || savingsTokenBalance.eq(0)

  const primaryAction = guestMode
    ? { title: 'Connect Wallet' as const, action: openConnectModal }
    : {
        title: 'Deposit' as const,
        action: () => openDialog(savingsDepositDialogConfig, { initialToken: mostValuableAsset.token, savingsToken }),
      }

  return (
    <PageLayout>
      <PageHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[202px_1fr]">
        <div
          className={cn(
            '-ml-5 -mr-5 flex overflow-x-auto pr-5 pl-5 lg:mr-0 lg:ml-0 lg:block lg:overflow-auto lg:pr-0 lg:pl-0',
            '[mask-image:linear-gradient(to_right,rgb(0,0,0,0.3),black_6%,black_94%,rgb(0,0,0,0.3))] lg:[mask-image:none]',
          )}
        >
          <AccountsNavigation
            accounts={allAccounts}
            selectedAccount={savingsToken.symbol}
            setSelectedAccount={setSelectedAccount}
            variant="vertical"
            className="hidden lg:block"
          />
          <AccountsNavigation
            accounts={allAccounts}
            selectedAccount={savingsToken.symbol}
            setSelectedAccount={setSelectedAccount}
            variant="horizontal"
            className="lg:hidden"
          />
        </div>
        <div className="flex flex-col gap-6">
          {displayDepositCallToAction ? (
            <DepositCTAPanel
              savingsRate={interestData.APY}
              entryTokens={entryAssets.map((asset) => asset.token)}
              savingsToken={savingsToken}
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
              underlyingToken={underlyingToken}
              savingsToken={savingsToken}
              savingsTokenBalance={savingsTokenBalance}
              calculateUnderlyingTokenBalance={interestData.calculateUnderlyingTokenBalance}
              balanceRefreshIntervalInMs={interestData.balanceRefreshIntervalInMs}
              openDepositDialog={() =>
                openDialog(savingsDepositDialogConfig, { initialToken: mostValuableAsset.token, savingsToken })
              }
              openSendDialog={() =>
                openDialog(savingsWithdrawDialogConfig, {
                  mode: 'send',
                  savingsToken,
                  underlyingToken,
                } as const)
              }
              openWithdrawDialog={() =>
                openDialog(savingsWithdrawDialogConfig, {
                  mode: 'withdraw',
                  savingsToken,
                  underlyingToken,
                } as const)
              }
              projections={interestData.currentProjections}
            />
          )}
          {migrationInfo && (
            <UpgradeSavingsBanner
              onUpgradeSavingsClick={migrationInfo.openSDaiToSUsdsUpgradeDialog}
              apyImprovement={migrationInfo.apyImprovement}
            />
          )}
          {chartsData.chartsSupported && <SavingsCharts savingsTokenSymbol={savingsToken.symbol} {...chartsData} />}
          <EntryAssetsPanel
            assets={entryAssets}
            openDialog={openDialog}
            showConvertDialogButton={showConvertDialogButton}
            migrationInfo={migrationInfo}
            savingsToken={savingsToken}
          />
        </div>
      </div>
    </PageLayout>
  )
}
