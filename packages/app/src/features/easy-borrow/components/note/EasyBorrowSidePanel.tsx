import { Percentage } from '@/domain/types/NumericValues'

import { BorrowRate } from './BorrowRate'

export interface EasyBorrowSidePanelProps {
  borrowRate: Percentage
}

export function EasyBorrowSidePanel({ borrowRate }: EasyBorrowSidePanelProps) {
  return (
    <div className="hidden xl:block">
      <div className="fixed mt-10 flex flex-col gap-12 p-12">
        <BorrowRate borrowRate={borrowRate} />
      </div>
    </div>
  )
}
