import { TokenWithBalance } from '@/domain/common/types'
import { SavingsDisplayType } from '@/domain/savings-charts/useMyEarningsInfo/getSavingsDisplayType'
import { SavingsInfo } from '@/domain/savings-info/types'
import { assertNever } from '@/utils/assertNever'

interface SelectSavingsDataByDisplayTypeParams {
  displayType: SavingsDisplayType
  savingsUsdsInfo: SavingsInfo | null
  sUSDSWithBalance: TokenWithBalance | undefined
  savingsDaiInfo: SavingsInfo | null
  sDaiWithBalance: TokenWithBalance | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function selectMyEarningsSavingsDataByDisplayType({
  displayType,
  savingsUsdsInfo,
  sUSDSWithBalance,
  savingsDaiInfo,
  sDaiWithBalance,
}: SelectSavingsDataByDisplayTypeParams) {
  switch (displayType) {
    case 'usds':
      return { savingsInfo: savingsUsdsInfo, savingsTokenWithBalance: sUSDSWithBalance }

    case 'dai':
      return { savingsInfo: savingsDaiInfo, savingsTokenWithBalance: sDaiWithBalance }

    case 'all':
    case 'none':
    case 'unsupported':
      return { savingsInfo: null, savingsTokenWithBalance: undefined }

    default:
      assertNever(displayType)
  }
}
