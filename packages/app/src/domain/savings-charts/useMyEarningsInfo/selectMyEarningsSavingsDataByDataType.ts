import { TokenWithBalance } from '@/domain/common/types'
import { SavingsDisplayType } from '@/domain/savings-charts/useMyEarningsInfo/getSavingsDisplayType'
import { SavingsInfo } from '@/domain/savings-info/types'
import { assertNever } from '@marsfoundation/common-universal'

interface SelectSavingsDataByDisplayTypeParams {
  displayType: SavingsDisplayType
  savingsUsdsInfo: SavingsInfo | null
  susdsWithBalance: TokenWithBalance | undefined
  savingsDaiInfo: SavingsInfo | null
  sdaiWithBalance: TokenWithBalance | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function selectMyEarningsSavingsDataByDisplayType({
  displayType,
  savingsUsdsInfo,
  susdsWithBalance,
  savingsDaiInfo,
  sdaiWithBalance,
}: SelectSavingsDataByDisplayTypeParams) {
  switch (displayType) {
    case 'usds':
      return { savingsInfo: savingsUsdsInfo, savingsTokenWithBalance: susdsWithBalance }

    case 'dai':
      return { savingsInfo: savingsDaiInfo, savingsTokenWithBalance: sdaiWithBalance }

    case 'all':
    case 'none':
    case 'unsupported':
      return { savingsInfo: null, savingsTokenWithBalance: undefined }

    default:
      assertNever(displayType)
  }
}
