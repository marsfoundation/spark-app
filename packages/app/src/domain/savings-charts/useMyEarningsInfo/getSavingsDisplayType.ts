import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'

interface GetSavingsDisplayTypeParams {
  savingsUsdsInfo: SavingsInfo | null
  sUSDSWithBalance: TokenWithBalance | undefined
  savingsDaiInfo: SavingsInfo | null
  sDaiWithBalance: TokenWithBalance | undefined
}

export type SavingsDisplayType = 'all' | 'dai' | 'usds' | 'unsupported' | 'none'

export function getSavingsDisplayType({
  savingsUsdsInfo,
  sUSDSWithBalance,
  savingsDaiInfo,
  sDaiWithBalance,
}: GetSavingsDisplayTypeParams): SavingsDisplayType {
  if (!savingsUsdsInfo && !savingsDaiInfo) return 'unsupported'

  const hasDaiBalance = sDaiWithBalance?.balance.gt(0) ?? false
  const hasUsdsBalance = sUSDSWithBalance?.balance.gt(0) ?? false

  if (hasDaiBalance && hasUsdsBalance) return 'all'
  if (hasDaiBalance) return 'dai'
  if (hasUsdsBalance) return 'usds'

  return 'none'
}
