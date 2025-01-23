import { Token } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { cva } from 'class-variance-authority'
import { savingsTokenToAccountType } from '../common/utils'
import { Actions } from './components/Actions'
import { Details } from './components/Details'
import { Header } from './components/Header'
import { Stats } from './components/Stats'

export interface DepositCTAPanelProps {
  globalStats: {
    savingsRate: Percentage
    tvl: NormalizedUnitNumber
    liquidity: NormalizedUnitNumber
    users: NormalizedUnitNumber
  }
  inputTokens: Token[]
  savingsToken: Token
  description: {
    text: string
    docsLink: string
  }
  actions: {
    primary: {
      title: 'Connect Wallet' | 'Deposit'
      action: () => void
    }
    secondary: {
      title: 'Try in Sandbox'
      action: () => void
    }
  }
}

export function DepositCTAPanel({
  inputTokens,
  savingsToken,
  globalStats,
  description,
  actions,
}: DepositCTAPanelProps) {
  return (
    <Panel
      spacing="m"
      className={cn(
        'grid grid-cols-1 gap-8 md:grid-cols-[3fr_2fr]',
        panelBgVariants({ bg: savingsTokenToAccountType(savingsToken) }),
      )}
    >
      <div className="flex flex-col gap-4 md:gap-14">
        <Header savingsRate={globalStats.savingsRate} savingsToken={savingsToken} inputTokens={inputTokens} />
        <Details inputTokens={inputTokens} savingsToken={savingsToken} description={description} />
      </div>
      <div className="mt-auto flex flex-col gap-5">
        <Stats globalStats={globalStats} />
        <Actions actions={actions} />
      </div>
    </Panel>
  )
}

const panelBgVariants = cva('bg-cover bg-right bg-no-repeat', {
  variants: {
    bg: {
      susds: 'bg-[url(/src/ui/assets/savings/accounts/usds-bg.svg)] bg-primary-inverse',
      susdc: 'bg-[url(/src/ui/assets/savings/accounts/usdc-bg.svg)] bg-primary-inverse',
      sdai: 'bg-[url(/src/ui/assets/savings/accounts/dai-bg.svg)] bg-primary-inverse',
    },
  },
})
