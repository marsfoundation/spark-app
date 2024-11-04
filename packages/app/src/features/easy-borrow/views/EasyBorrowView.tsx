import { RiskAcknowledgementInfo } from '@/domain/liquidation-risk-warning/types'
import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { UserPositionSummary } from '@/domain/market-info/marketInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { UseFormReturn } from 'react-hook-form'
import { BorrowRateBanner } from '../components/BorrowRateBanner'
import { EasyBorrowPanel } from '../components/EasyBorrowPanel'
import { EasyBorrowSidePanel } from '../components/note/EasyBorrowSidePanel'
import { FormFieldsForAssetClass } from '../logic/form/form'
import { EasyBorrowFormSchema } from '../logic/form/validation'
import { ExistingPosition, PageStatus } from '../logic/types'
import { BorrowDetails } from '../logic/useEasyBorrow'

export interface EasyBorrowViewProps {
  pageStatus: PageStatus
  borrowDetails: BorrowDetails
  form: UseFormReturn<EasyBorrowFormSchema>
  assetsToBorrowFields: FormFieldsForAssetClass
  assetsToDepositFields: FormFieldsForAssetClass
  alreadyDeposited: ExistingPosition
  alreadyBorrowed: ExistingPosition
  updatedPositionSummary: UserPositionSummary
  liquidationDetails?: LiquidationDetails
  setDesiredLoanToValue: (desiredLtv: Percentage) => void
  riskAcknowledgement: RiskAcknowledgementInfo
  objectives: Objective[]
  guestMode: boolean
  openConnectModal: () => void
  openSandboxModal: () => void
  healthFactorPanelRef: React.RefObject<HTMLDivElement>
  actionsContext: InjectedActionsContext
}

export function EasyBorrowView(props: EasyBorrowViewProps) {
  return (
    <PageLayout>
      <BorrowRateBanner assetsToBorrowMeta={props.borrowDetails} />
      <div className="mt-8 flex justify-center">
        <EasyBorrowPanel {...props} />
        {/* <EasyBorrowSidePanel borrowRate={props.borrowDetails.borrowRate} /> */}
      </div>
    </PageLayout>
  )
}
