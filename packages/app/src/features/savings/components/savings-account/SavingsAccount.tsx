import { TokenWithBalance } from '@/domain/common/types'
import { Token } from '@/domain/types/Token'
import { links } from '@/ui/constants/links'
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
  openDepositDialog: (tokenToDeposit: Token) => void
  openSendDialog: () => void
  openWithdrawDialog: () => void
  openConvertStablesDialog: () => void
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
  openDepositDialog,
  openSendDialog,
  openWithdrawDialog,
  openConvertStablesDialog,
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
        action: () => openDepositDialog(mostValuableAsset.token),
      }

  return (
    <div className="grid grid-cols-1 gap-6">
      {displayDepositCallToAction ? (
        <DepositCTAPanel
          savingsRate={interestData.APY}
          entryTokens={supportedStablecoins.map((asset) => asset.token)}
          savingsToken={savingsToken}
          description={{
            text: `Deposit to Savings ${underlyingToken.symbol} to tap into the most predictable savings rate at scale! Learn more about it `,
            docsLink: links.docs.earningSavings,
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
          openDepositDialog={() => openDepositDialog(mostValuableAsset.token)}
          openSendDialog={openSendDialog}
          openWithdrawDialog={openWithdrawDialog}
          oneYearProjection={interestData.oneYearProjection}
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
        openDepositDialog={openDepositDialog}
        openConvertStablesDialog={openConvertStablesDialog}
        showConvertDialogButton={showConvertDialogButton}
      />
    </div>
  )
}
