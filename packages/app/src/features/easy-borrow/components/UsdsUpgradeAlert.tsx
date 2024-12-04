import { Alert } from '@/ui/molecules/new/alert/Alert'
import { testIds } from '@/ui/utils/testIds'
import { BorrowDetails } from '../logic/useEasyBorrow'

export interface UsdsUpgradeAlertProps {
  borrowDetails: BorrowDetails
  variant: 'borrow' | 'success'
  className?: string
}

export function UsdsUpgradeAlert({ borrowDetails, variant, className }: UsdsUpgradeAlertProps) {
  const { dai, usds } = borrowDetails
  return (
    <Alert variant="info" className={className} data-testid={testIds.easyBorrow.form.usdsBorrowAlert}>
      {variant === 'borrow' && (
        <>
          Borrowing {usds} creates a {dai} borrow position in Spark Lend. The borrowed {dai} is upgraded to {usds} in a
          separate action listed in the actions panel below. You will see your {dai} position in the portfolio, and your
          new {usds} balance will be reflected on the Savings page.
        </>
      )}
      {variant === 'success' && (
        <>
          Borrowing {usds} created a {dai} borrow position in Spark Lend. The borrowed {dai} was upgraded to {usds}.
          Check your {dai} position in the portfolio and your new {usds} balance on the Savings page.
        </>
      )}
    </Alert>
  )
}
