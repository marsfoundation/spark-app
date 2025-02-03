import { OpenDialogFunction } from '@/domain/state/dialogs'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { cn } from '@/ui/utils/style'
import { PageHeader } from '../components/PageHeader'
import { AccountsNavigation } from '../components/accounts-navigation/AccountsNavigation'
import { GeneralStatsBar } from '../components/general-stats-bar/GeneralStatsBar'
import { SavingsAccount } from '../components/savings-account/SavingsAccount'
import { ShortAccountDefinition } from '../logic/useSavings'
import { AccountDefinition } from '../logic/useSavings'

export interface SavingsViewProps {
  selectedAccount: AccountDefinition
  users: number
  tvl: number
  // @todo: Pass separate functions for each dialog after removing old views
  openDialog: OpenDialogFunction
  openSandboxModal: () => void
  openConnectModal: () => void
  guestMode: boolean
  allAccounts: ShortAccountDefinition[]
  setSelectedAccount: (savingsTokenSymbol: TokenSymbol) => void
}

export function SavingsView({
  selectedAccount,
  openDialog,
  openSandboxModal,
  openConnectModal,
  guestMode,
  setSelectedAccount,
  allAccounts,
  users,
  tvl,
}: SavingsViewProps) {
  const showNavigation = allAccounts.length > 1

  return (
    <PageLayout>
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader />
        <GeneralStatsBar users={users} tvl={tvl} liquidity={selectedAccount.liquidity} />
      </div>
      <div className={cn('grid grid-cols-1 gap-6', showNavigation && 'lg:grid-cols-[202px_1fr]')}>
        {showNavigation && (
          <div
            className={cn(
              '-ml-5 -mr-5 flex overflow-x-auto pr-5 pl-5 lg:mr-0 lg:ml-0 lg:block lg:overflow-visible lg:pr-0 lg:pl-0',
              '[mask-image:linear-gradient(to_right,rgb(0,0,0,0.3),black_6%,black_94%,rgb(0,0,0,0.3))] lg:[mask-image:none]',
            )}
          >
            <AccountsNavigation
              accounts={allAccounts}
              selectedAccount={selectedAccount.savingsToken.symbol}
              setSelectedAccount={setSelectedAccount}
              variant="vertical"
              className="hidden lg:block"
            />
            <AccountsNavigation
              accounts={allAccounts}
              selectedAccount={selectedAccount.savingsToken.symbol}
              setSelectedAccount={setSelectedAccount}
              variant="horizontal"
              className="lg:hidden"
            />
          </div>
        )}
        <SavingsAccount
          {...selectedAccount}
          openDialog={openDialog}
          openSandboxModal={openSandboxModal}
          openConnectModal={openConnectModal}
          guestMode={guestMode}
        />
      </div>
    </PageLayout>
  )
}
