import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Typography } from '@/ui/atoms/typography/Typography'
import { testIds } from '@/ui/utils/testIds'

export interface BorrowRateProps {
  borrowRate: Percentage
}

export function BorrowRate({ borrowRate }: BorrowRateProps) {
  return (
    <div className="mt-4 flex items-center justify-between xl:mt-0 xl:block">
      <Typography variant="h4">Borrow rate</Typography>
      <Typography variant="h3" className="mt-2 text-base xl:text-2xl" data-testid={testIds.easyBorrow.form.borrowRate}>
        {formatPercentage(borrowRate, { skipSign: true })}
        <Typography
          element="span"
          className='ml-2 font-normal text-base text-primary xl:text-2xl xl:text-prompt-foreground'
        >
          %
        </Typography>
      </Typography>
    </div>
  )
}
