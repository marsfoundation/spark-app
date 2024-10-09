import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { useChainId } from 'wagmi'

export interface UseUpradeOptionsParams {
  chainId?: number
}
export interface UpgradeOptions {
  dai: TokenWithBalance
  usds: TokenWithBalance
}

export function useUpgradeOptions(params: UseUpradeOptionsParams): UpgradeOptions | undefined {
  const currentChainId = useChainId()
  const chainId = params.chainId ?? currentChainId

  const chainConfig = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens, chainId })

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
