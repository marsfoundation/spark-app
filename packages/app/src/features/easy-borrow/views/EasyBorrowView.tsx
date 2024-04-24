import { UseFormReturn } from 'react-hook-form'

import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { UserPositionSummary } from '@/domain/market-info/marketInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Objective } from '@/features/actions/logic/types'
import { PageLayout } from '@/ui/layouts/PageLayout'

import { BorrowRateBanner } from '../components/BorrowRateBanner'
import { EasyBorrowPanel } from '../components/EasyBorrowPanel'
import { EasyBorrowSidePanel } from '../components/note/EasyBorrowSidePanel'
import { FormFieldsForAssetClass } from '../logic/form/form'
import { EasyBorrowFormSchema } from '../logic/form/validation'
import { ExistingPosition, PageStatus } from '../logic/types'

export interface EasyBorrowViewProps {
  pageStatus: PageStatus

  form: UseFormReturn<EasyBorrowFormSchema>
  assetsToBorrowFields: FormFieldsForAssetClass
  assetsToDepositFields: FormFieldsForAssetClass
  alreadyDeposited: ExistingPosition
  alreadyBorrowed: ExistingPosition
  updatedPositionSummary: UserPositionSummary
  liquidationDetails?: LiquidationDetails
  setDesiredLoanToValue: (desiredLtv: Percentage) => void

  objectives: Objective[]

  assetToBorrow: {
    symbol: TokenSymbol
    borrowRate: Percentage
  }
  guestMode: boolean
  openConnectModal: () => void

  healthFactorPanelRef: React.RefObject<HTMLDivElement>
}

export function EasyBorrowView(props: EasyBorrowViewProps) {
  const { assetToBorrow } = props
  return (
    <PageLayout>
      <BorrowRateBanner symbol={assetToBorrow.symbol} borrowRate={assetToBorrow.borrowRate} />
      <div className="mt-8 flex justify-center">
        <EasyBorrowPanel {...props} />
        <EasyBorrowSidePanel borrowRate={assetToBorrow.borrowRate} />
      </div>
    </PageLayout>
  )
}
