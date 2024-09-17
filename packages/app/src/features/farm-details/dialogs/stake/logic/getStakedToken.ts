import { TokenWithValue } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'

export function getStakedToken(
  stakingToken: Token,
  stakingTokenRouteItem: TxOverviewRouteItem | undefined,
): TokenWithValue {
  return {
    token: stakingToken,
    value: stakingTokenRouteItem?.value ?? NormalizedUnitNumber(0),
  }
}
