import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Typography } from '@/ui/atoms/typography/Typography'
import { testIds } from '@/ui/utils/testIds'

interface LoanToValueProps {
  className?: string
  loanToValue?: Percentage
  maxLoanToValue?: Percentage
}
export function LoanToValue({ className, loanToValue, maxLoanToValue }: LoanToValueProps) {
  if (!loanToValue || !maxLoanToValue) return null

  return (
    <div className={className}>
      <div className="flex flex-row justify-between">
        <Typography variant="h4">Loan to Value (LTV)</Typography>
        <Typography variant="h4" data-testid={testIds.easyBorrow.form.ltv}>
          {formatPercentage(loanToValue)}
        </Typography>
      </div>

      <div className="mt-2 flex flex-row justify-between">
        <Typography variant="prompt">Max LTV</Typography>
        <Typography variant="prompt">max {formatPercentage(maxLoanToValue)}</Typography>
      </div>
    </div>
  )
}
