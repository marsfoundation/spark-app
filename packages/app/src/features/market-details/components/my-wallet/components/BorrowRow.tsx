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
      <div className='grid grid-cols-1 border-slate-700/10 border-t py-4'>
        <p className='text-slate-500 text-xs leading-none'>To borrow you need to deposit any other asset first.</p>
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
