import { TokenWithBalance } from '@/domain/common/types'
import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'

export interface UpgradeOptions {
  dai: TokenWithBalance
  usds: TokenWithBalance
}

export function useUpgradeOptions(): UpgradeOptions | undefined {
  const chainConfig = useChainConfigEntry()
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens })

  if (!chainConfig.USDSSymbol) {
    return undefined
  }

  const usds = tokensInfo.findOneTokenWithBalanceBySymbol(chainConfig.USDSSymbol)
  const dai = tokensInfo.findOneTokenWithBalanceBySymbol(chainConfig.daiSymbol)

  return {
    dai,
    usds,
  }
}
