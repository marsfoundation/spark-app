import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Link } from '@/ui/atoms/link/Link'
import { Progress } from '@/ui/atoms/progress/Progress'
import { links } from '@/ui/constants/links'
import { Info } from '@/ui/molecules/info/Info'

interface DebtCeilingProgressProps {
  token: Token
  debt: NormalizedUnitNumber
  debtCeiling: NormalizedUnitNumber
  className?: string
}

export function DebtCeilingProgress({ token, debt, debtCeiling }: DebtCeilingProgressProps) {
  const value = debt.dividedBy(debtCeiling).multipliedBy(100).toNumber()
  return (
    <div className='col-span-3 mt-6 flex flex-col gap-4 rounded-2xl border border-basics-border p-4 sm:col-span-2 sm:col-start-2 sm:mt-8'>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <p className="text-basics-dark-grey text-xs leading-none">Isolated Debt Ceiling</p>
          <Info>
            Debt ceiling limits the amount possible to borrow against this asset by protocol users. Debt ceiling is
            specific to assets in isolation mode and is denoted in USD.{' '}
            <Link to={links.docs.isolationModeBorrowingPower} external>
              Learn more
            </Link>
          </Info>
        </div>
        <p className="text-xs leading-none">
          <span className="text-basics-black">{token.formatUSD(debt, { compact: true })}</span>
          <span className="text-basics-dark-grey"> of {token.formatUSD(debtCeiling, { compact: true })}</span>
        </p>
      </div>
      <Progress value={value} />
    </div>
  )
}
