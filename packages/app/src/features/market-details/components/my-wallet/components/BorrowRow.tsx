import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

import { ActionRow } from './ActionRow'

interface BorrowRowProps {
  token: Token
  availableToBorrow: NormalizedUnitNumber
  onAction: () => void
}

export function BorrowRow({ token, availableToBorrow, onAction }: BorrowRowProps) {
  if (availableToBorrow.isZero()) {
    return (
      <div className="grid grid-cols-1 border-t border-slate-700/10 py-4">
        <p className="text-xs leading-none text-slate-500">To borrow you need to deposit any other asset first.</p>
      </div>
    )
  }

  return (
    <ActionRow
      token={token}
      value={availableToBorrow}
      label="Available to borrow"
      buttonText="Borrow"
      onAction={onAction}
    />
  )
}
