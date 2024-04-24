import { Percentage } from '@/domain/types/NumericValues'

import { BorrowRate } from './BorrowRate'

export interface EasyBorrowNoteProps {
  borrowRate: Percentage
}

export function EasyBorrowNote({ borrowRate }: EasyBorrowNoteProps) {
  return (
    <div className="mt-8 xl:hidden">
      <BorrowRate borrowRate={borrowRate} />
    </div>
  )
}
