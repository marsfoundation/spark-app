import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { cn } from '@/ui/utils/style'
import { PageHeader } from '../components/PageHeader'
import { AccountsNavigation } from '../components/accounts-navigation/AccountsNavigation'
import { GeneralStatsBar } from '../components/general-stats-bar/GeneralStatsBar'
import { SavingsAccount } from '../components/savings-account/SavingsAccount'
import { UseGeneralStatsResult } from '../logic/general-stats/useGeneralStats'
import { ShortAccountDefinition } from '../logic/useSavings'
import { AccountDefinition } from '../logic/useSavings'

export interface SavingsViewProps {
  selectedAccount: AccountDefinition
  generalStats: UseGeneralStatsResult
  openDepositDialog: (tokenToDeposit: Token) => void
  openConvertStablesDialog: () => void
  openSendDialog: () => void
  openWithdrawDialog: () => void
  openSandboxModal: () => void
  openConnectModal: () => void
  guestMode: boolean
  allAccounts: ShortAccountDefinition[]
  setSelectedAccount: (savingsTokenSymbol: TokenSymbol) => void
  invalidateSavingsConverterQuery: () => void
}

export function SavingsView({
  selectedAccount,
  openDepositDialog,
  openConvertStablesDialog,
  openSendDialog,
  openWithdrawDialog,
  openSandboxModal,
  openConnectModal,
  guestMode,
  setSelectedAccount,
  allAccounts,
  generalStats,
  invalidateSavingsConverterQuery,
}: SavingsViewProps) {
  const showNavigation = allAccounts.length > 1

  return (
    <PageLayout>
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader />
        <GeneralStatsBar accountSavingsToken={selectedAccount.savingsToken} generalStatsResult={generalStats} />
      </div>
      <div className={cn('grid grid-cols-1 gap-6', showNavigation && 'xl:grid-cols-[202px_1fr]')}>
        {showNavigation && (
          <div
            className={cn(
              '-ml-5 -mr-5 flex overflow-x-auto pr-5 pl-5 xl:mr-0 xl:ml-0 xl:block xl:overflow-visible xl:pr-0 xl:pl-0',
              '[mask-image:linear-gradient(to_right,rgb(0,0,0,0.3),black_6%,black_94%,rgb(0,0,0,0.3))] xl:[mask-image:none]',
            )}
          >
            <AccountsNavigation
              accounts={allAccounts}
              selectedAccount={selectedAccount.savingsToken.symbol}
              setSelectedAccount={setSelectedAccount}
              variant="vertical"
              className="hidden xl:block"
            />
            <AccountsNavigation
              accounts={allAccounts}
              selectedAccount={selectedAccount.savingsToken.symbol}
              setSelectedAccount={setSelectedAccount}
              variant="horizontal"
              className="xl:hidden"
            />
          </div>
        )}
        <SavingsAccount
          {...selectedAccount}
          invalidateSavingsConverterQuery={invalidateSavingsConverterQuery}
          openDepositDialog={openDepositDialog}
          openConvertStablesDialog={openConvertStablesDialog}
          openSendDialog={openSendDialog}
          openWithdrawDialog={openWithdrawDialog}
          openSandboxModal={openSandboxModal}
          openConnectModal={openConnectModal}
          guestMode={guestMode}
        />
      </div>
    </PageLayout>
  )
}
