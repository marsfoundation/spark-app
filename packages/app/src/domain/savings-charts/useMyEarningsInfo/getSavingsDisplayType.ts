import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'

interface GetSavingsDisplayTypeParams {
  savingsUsdsInfo: SavingsInfo | null
  susdsWithBalance: TokenWithBalance | undefined
  savingsDaiInfo: SavingsInfo | null
  sdaiWithBalance: TokenWithBalance | undefined
}

export type SavingsDisplayType = 'all' | 'dai' | 'usds' | 'unsupported' | 'none'

export function getSavingsDisplayType({
  savingsUsdsInfo,
  susdsWithBalance,
  savingsDaiInfo,
  sdaiWithBalance,
}: GetSavingsDisplayTypeParams): SavingsDisplayType {
  if (!savingsUsdsInfo && !savingsDaiInfo) return 'unsupported'

  const hasDaiBalance = sdaiWithBalance?.balance.gt(0) ?? false
  const hasUsdsBalance = susdsWithBalance?.balance.gt(0) ?? false

  if (hasDaiBalance && hasUsdsBalance) return 'all'
  if (hasDaiBalance) return 'dai'
  if (hasUsdsBalance) return 'usds'

  return 'none'
}
