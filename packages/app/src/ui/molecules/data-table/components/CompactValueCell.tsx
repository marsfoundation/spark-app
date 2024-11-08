import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
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
        <div className="typography-label-6 w-full text-secondary">{mobileViewOptions.rowTitle}</div>
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
      <div
        className={cn('flex w-full flex-row justify-end', dimmed && 'text-basics-dark-grey/70')}
        data-testid={dataTestId}
      >
        —
      </div>
    )
  }
  return (
    <div className={cn('flex flex-col', className)} data-testid={dataTestId}>
      <div
        className={cn(
          'typography-label-4 flex w-full flex-row justify-end text-primary',
          dimmed && 'text-basics-dark-grey/70',
        )}
      >
        {token.format(value, { style: compactValue ? 'compact' : 'auto' })}
      </div>
      <div className="flex w-full flex-row justify-end">
        <div className={cn('typography-body-6 text-secondary', dimmed && 'text-basics-dark-grey/30')}>
          {token.formatUSD(value, { compact: compactValue })}
        </div>
      </div>
    </div>
  )
}
