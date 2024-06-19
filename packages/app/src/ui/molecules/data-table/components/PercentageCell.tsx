import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Typography } from '@/ui/atoms/typography/Typography'

import { MobileViewOptions } from '../types'

interface PercentageCellProps {
  value: Percentage | undefined
  mobileViewOptions?: MobileViewOptions
}

export function PercentageCell({ value, mobileViewOptions }: PercentageCellProps) {
  if (mobileViewOptions?.isMobileView) {
    return (
      <div className="flex flex-row items-center justify-between">
        <Typography variant="prompt">{mobileViewOptions.rowTitle}</Typography>
        <div>{formatPercentage(value)}</div>
      </div>
    )
  }

  return <div className="flex w-full justify-end">{formatPercentage(value)} </div>
}
