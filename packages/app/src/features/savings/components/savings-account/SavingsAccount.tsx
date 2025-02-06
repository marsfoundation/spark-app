import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { Token } from '@/domain/types/Token'
import { savingsDepositDialogConfig } from '@/features/dialogs/savings/deposit/SavingsDepositDialog'
import { savingsWithdrawDialogConfig } from '@/features/dialogs/savings/withdraw/SavingsWithdrawDialog'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { MigrationInfo } from '../../logic/makeMigrationInfo'
import { ChartsData, InterestData, SavingsAccountSupportedStablecoin } from '../../logic/useSavings'
import { AccountMainPanelGroup } from '../account-main-panel-group/AccountMainPanelGroup'
import { DepositCTAPanel } from '../deposit-cta-panel/DepositCTAPanel'
import { EntryAssetsPanel } from '../entry-assets-panel/EntryAssetsPanel'
import { SavingsCharts } from '../savings-charts/SavingsCharts'
import { UpgradeSavingsBanner } from '../upgrade-savings-baner/UpgradeSavingsBanner'

export interface SavingsAccountProps {
  savingsToken: Token
  savingsTokenBalance: NormalizedUnitNumber
  underlyingToken: Token
  interestData: InterestData
  supportedStablecoins: SavingsAccountSupportedStablecoin[]
  mostValuableAsset: TokenWithBalance
  showConvertDialogButton: boolean
  chartsData: ChartsData
  // @todo: Pass separate functions for each dialog after removing old views
  openDialog: OpenDialogFunction
  openSandboxModal: () => void
  openConnectModal: () => void
  guestMode: boolean
  migrationInfo?: MigrationInfo
}

export function SavingsAccount({
  savingsToken,
  savingsTokenBalance,
  underlyingToken,
  interestData,
  supportedStablecoins,
  mostValuableAsset,
  showConvertDialogButton,
  chartsData,
  openDialog,
  openSandboxModal,
  openConnectModal,
  guestMode,
  migrationInfo,
}: SavingsAccountProps) {
  const displayDepositCallToAction = guestMode || savingsTokenBalance.eq(0)
  const displayUpgradeBanner = migrationInfo !== undefined && savingsTokenBalance.gt(0)
  const primaryAction = guestMode
    ? { title: 'Connect Wallet' as const, action: openConnectModal }
    : {
        title: 'Deposit' as const,
        action: () => openDialog(savingsDepositDialogConfig, { initialToken: mostValuableAsset.token, savingsToken }),
      }

  return (
    <div className="grid grid-cols-1 gap-6">
      {displayDepositCallToAction ? (
        <DepositCTAPanel
          savingsRate={interestData.APY}
          entryTokens={supportedStablecoins.map((asset) => asset.token)}
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
          className="min-h-[352px]"
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
          apy={interestData.APY}
          className="min-h-[352px]"
        />
      )}
      {displayUpgradeBanner && (
        <UpgradeSavingsBanner
          onUpgradeSavingsClick={migrationInfo.openSDaiToSUsdsUpgradeDialog}
          apyImprovement={migrationInfo.apyImprovement}
        />
      )}
      {chartsData.chartsSupported && <SavingsCharts savingsTokenSymbol={savingsToken.symbol} {...chartsData} />}
      <EntryAssetsPanel
        assets={supportedStablecoins}
        openDialog={openDialog}
        showConvertDialogButton={showConvertDialogButton}
        savingsToken={savingsToken}
      />
    </div>
  )
}
