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
  'data-testid'?: string
}

export function CompactValueCell({
  value,
  token,
  compactValue,
  dimmed,
  hideEmpty = false,
  mobileViewOptions,
  'data-testid': dataTestId,
}: CompactValueCellProps) {
  if (mobileViewOptions?.isMobileView) {
    return (
      <div className="flex flex-row items-center justify-between">
        <Typography variant="prompt" className="w-full">
          {mobileViewOptions.rowTitle}
        </Typography>
        <CompactValue
          token={token}
          value={value}
          dimmed={dimmed}
          hideEmpty={hideEmpty}
          compactValue={compactValue}
          data-testid={dataTestId}
        />
      </div>
    )
  }

  return (
    <CompactValue
      token={token}
      value={value}
      dimmed={dimmed}
      hideEmpty={hideEmpty}
      compactValue={compactValue}
      data-testid={dataTestId}
    />
  )
}

interface CompactValueProps {
  token: Token
  value: NormalizedUnitNumber
  compactValue?: boolean
  dimmed?: boolean
  hideEmpty?: boolean
  className?: string
  'data-testid'?: string
}

function CompactValue({
  token,
  value,
  compactValue,
  dimmed,
  hideEmpty,
  className,
  'data-testid': dataTestId,
}: CompactValueProps) {
  if (hideEmpty && value.isZero()) {
    return (
      <div className={cn('flex w-full flex-row justify-end', dimmed && 'text-white/40')} data-testid={dataTestId}>
        —
      </div>
    )
  }
  return (
    <div className={cn('flex flex-col', className)} data-testid={dataTestId}>
      <div className={cn('flex w-full flex-row justify-end', dimmed && 'text-white/40')}>
        {token.format(value, { style: compactValue ? 'compact' : 'auto' })}
      </div>
      <div className="flex w-full flex-row justify-end">
        <Typography variant="prompt" className={cn(dimmed && 'text-white/30')}>
          {token.formatUSD(value, { compact: compactValue })}
        </Typography>
      </div>
    </div>
  )
}
