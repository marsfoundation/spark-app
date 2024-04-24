import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Typography } from '@/ui/atoms/typography/Typography'
import { cn } from '@/ui/utils/style'

import { MobileViewOptions } from '../types'

interface CompactValueCellProps {
  token: Token
  value: NormalizedUnitNumber
  compactValue?: boolean
  dimmed?: boolean
  hideEmpty?: boolean
  mobileViewOptions?: MobileViewOptions
}

export function CompactValueCell({
  value,
  token,
  compactValue,
  dimmed,
  hideEmpty = false,
  mobileViewOptions,
}: CompactValueCellProps) {
  if (mobileViewOptions?.isMobileView) {
    return (
      <div className="flex flex-row items-center justify-between">
        <Typography variant="prompt" className="w-full">
          {mobileViewOptions.rowTitle}
        </Typography>
        <CompactValue token={token} value={value} dimmed={dimmed} hideEmpty={hideEmpty} compactValue={compactValue} />
      </div>
    )
  }

  return <CompactValue token={token} value={value} dimmed={dimmed} hideEmpty={hideEmpty} compactValue={compactValue} />
}

interface CompactValueProps {
  token: Token
  value: NormalizedUnitNumber
  compactValue?: boolean
  dimmed?: boolean
  hideEmpty?: boolean
  className?: string
}

function CompactValue({ token, value, compactValue, dimmed, hideEmpty, className }: CompactValueProps) {
  if (hideEmpty && value.isZero()) {
    return <div className={cn('flex w-full flex-row justify-end', dimmed && 'text-basics-dark-grey/70')}>—</div>
  }
  return (
    <div className={cn('flex flex-col', className)}>
      <div className={cn('flex w-full flex-row justify-end', dimmed && 'text-basics-dark-grey/70')}>
        {token.format(value, { style: compactValue ? 'compact' : 'auto' })}
      </div>
      <div className="flex w-full flex-row justify-end">
        <Typography variant="prompt" className={cn(dimmed && 'text-basics-dark-grey/30')}>
          {token.formatUSD(value, { compact: compactValue })}
        </Typography>
      </div>
    </div>
  )
}
