import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { bigNumberify } from '@/utils/bigNumber'

export interface MakeAssetsInWalletListParams {
  savingsEntryTokens: TokenWithBalance[]
}

export interface MakeAssetsInWalletListResults {
  maxBalanceToken: TokenWithBalance
  totalUSD: NormalizedUnitNumber
}

export function makeAssetsInWalletList({
  savingsEntryTokens,
}: MakeAssetsInWalletListParams): MakeAssetsInWalletListResults {
  const totalUSD = NormalizedUnitNumber(
    savingsEntryTokens.reduce((acc, { token, balance }) => acc.plus(token.toUSD(balance)), bigNumberify('0')),
  )
  const maxBalanceToken = savingsEntryTokens.reduce(
    (acc, token) => (token.balance.gt(acc.balance) ? token : acc),
    savingsEntryTokens[0]!,
  )

  return { totalUSD, maxBalanceToken }
}
