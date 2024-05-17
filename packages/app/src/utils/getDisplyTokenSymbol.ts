import { getChainConfigEntry } from '@/config/chain'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

/**
 * Returns the native token symbol if the token is wrapped.
 * @param chainId The chain ID.
 * @param tokenSymbol The token symbol.
 * @returns The native token symbol if the token is wrapped.
 */
export function getNativeTokenSymbolIfWrapped(chainId: number, tokenSymbol: TokenSymbol): TokenSymbol {
  const chainConfig = getChainConfigEntry(chainId)

  return tokenSymbol === chainConfig.nativeAssetInfo.wrappedNativeAssetSymbol
    ? chainConfig.nativeAssetInfo.nativeAssetSymbol
    : tokenSymbol
}
