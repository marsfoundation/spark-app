import { TokenWithBalance } from '@/domain/common/types'
import {
  UseSavingsChartsInfoQueryResult,
  useSavingsChartsInfoQuery,
} from '@/domain/savings-charts/useSavingsChartsInfoQuery'
import { SavingsInfo } from '@/domain/savings-info/types'
import { assertNever } from '@marsfoundation/common-universal'

export interface UseSavingsChartsInfoQueryAdapterParams {
  savingsUsdsInfo: SavingsInfo | null
  susdsWithBalance: TokenWithBalance | undefined
  savingsDaiInfo: SavingsInfo | null
  sdaiWithBalance: TokenWithBalance | undefined
}

export function useSavingsChartsInfoQueryAdapter({
  savingsUsdsInfo,
  susdsWithBalance,
  savingsDaiInfo,
  sdaiWithBalance,
}: UseSavingsChartsInfoQueryAdapterParams): UseSavingsChartsInfoQueryResult {
  const displayType = getSavingsDisplayType({
    savingsUsdsInfo,
    susdsWithBalance,
    savingsDaiInfo,
    sdaiWithBalance,
  })

  const { savingsInfo, savingsTokenWithBalance } = selectMyEarningsSavingsDataByDisplayType({
    savingsUsdsInfo,
    susdsWithBalance,
    savingsDaiInfo,
    sdaiWithBalance,
    displayType,
  })

  return useSavingsChartsInfoQuery({
    savingsInfo,
    savingsTokenWithBalance,
  })
}

export type SavingsDisplayType = 'all' | 'dai' | 'usds' | 'unsupported' | 'none'

export function getSavingsDisplayType({
  savingsUsdsInfo,
  susdsWithBalance,
  savingsDaiInfo,
  sdaiWithBalance,
}: UseSavingsChartsInfoQueryAdapterParams): SavingsDisplayType {
  if (!savingsUsdsInfo && !savingsDaiInfo) return 'unsupported'

  const hasDaiBalance = sdaiWithBalance?.balance.gt(0) ?? false
  const hasUsdsBalance = susdsWithBalance?.balance.gt(0) ?? false

  if (hasDaiBalance && hasUsdsBalance) return 'all'
  if (hasDaiBalance) return 'dai'
  if (hasUsdsBalance) return 'usds'

  return 'none'
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function selectMyEarningsSavingsDataByDisplayType({
  displayType,
  savingsUsdsInfo,
  susdsWithBalance,
  savingsDaiInfo,
  sdaiWithBalance,
}: UseSavingsChartsInfoQueryAdapterParams & { displayType: SavingsDisplayType }) {
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
