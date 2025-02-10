import { formatPercentage } from '@/domain/common/format'
import { Token } from '@/domain/types/Token'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { Percentage } from '@marsfoundation/common-universal'
import { cva } from 'class-variance-authority'
import { savingsTokenToAccountType } from '../../common/utils'

export interface HeaderProps {
  savingsToken: Token
  savingsRate: Percentage
  inputTokens: Token[]
}

export function Header({ savingsToken, savingsRate, inputTokens }: HeaderProps) {
  return (
    <div
      className={cn(
        'typography-heading-2 inline-flex bg-clip-text text-primary-inverse',
        headerBgVariants({ bg: savingsTokenToAccountType(savingsToken) }),
      )}
    >
      <div>
        Deposit your {inputTokens.length > 1 ? 'stablecoins' : inputTokens[0]!.symbol}
        <br />
        and earn{' '}
        <span className="text-transparent" data-testid={testIds.savings.account.depositCTA.apy}>
          {formatPercentage(savingsRate, { minimumFractionDigits: 0 })}
        </span>{' '}
        APY!
      </div>
    </div>
  )
}

const headerBgVariants = cva('bg-cover bg-right bg-no-repeat', {
  variants: {
    bg: {
      susds: 'bg-[radial-gradient(103.52%_1308.64%_at_8.98%_83.33%,#FFFFFF_0%,#80D98D_50%,#00C2A1_100%)]',
      susdc: 'bg-[radial-gradient(103.52%_1308.64%_at_8.98%_83.33%,#FFFFFF_0%,#80D98D_18%,#2775CA_68.5%)]',
      sdai: 'bg-[radial-gradient(103.52%_1308.64%_at_8.98%_83.33%,#FFFFFF_0%,#F4B731_8.5%,#8DD053_39%)]',
    },
  },
})
