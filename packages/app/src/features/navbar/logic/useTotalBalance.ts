import { MarketInfo } from '@/domain/market-info/marketInfo'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'

import { marketBalances } from '@/domain/wallet/marketBalances'
import { BalanceInfo } from '../types'

export interface UseTotalBalanceParams {
  marketInfo: UseQueryResult<MarketInfo>
}
export function useTotalBalance({ marketInfo }: UseTotalBalanceParams): BalanceInfo {
  const wagmiConfig = useConfig()
  const { address } = useAccount()
  const chainId = useChainId()

  const walletInfo = useQuery({
    ...marketBalances({
      wagmiConfig,
      account: address && CheckedAddress(address),
      chainId,
    }),
  })

  const balancesUSD = (walletInfo.data ?? []).map(({ address, balanceBaseUnit }) => {
    const token = marketInfo.data?.findOneReserveByUnderlyingAsset(address).token
    if (!token) {
      return NormalizedUnitNumber(0)
    }

    return token.toUSD(token.fromBaseUnit(balanceBaseUnit))
  })

  const totalBalanceUSD = balancesUSD.reduce(
    (sum, balance) => NormalizedUnitNumber(sum.plus(balance)),
    NormalizedUnitNumber(0),
  )

  return {
    totalBalanceUSD,
    isLoading: walletInfo.isLoading || marketInfo.isLoading,
  }
}
