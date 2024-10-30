import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

import { BorrowEligibilityStatus } from '@/domain/market-info/reserve-status'
import { ActionRow } from './ActionRow'

interface BorrowRowProps {
  token: Token
  availableToBorrow: NormalizedUnitNumber
  eligibility: BorrowEligibilityStatus
  onAction: () => void
}

export function BorrowRow({ token, availableToBorrow, eligibility, onAction }: BorrowRowProps) {
  if (eligibility === 'no') {
    return <InfoWrapper>Borrowing is not enabled for this asset.</InfoWrapper>
  }

  if (availableToBorrow.isZero()) {
    return <InfoWrapper>To borrow you need to deposit any other asset first.</InfoWrapper>
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

function InfoWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 border-white/15 border-t py-4">
      <p className="text-white/50 text-xs leading-none">{children}</p>
    </div>
  )
}
