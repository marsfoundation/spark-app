import { NativeAssetInfo } from '@/config/chain/types'
import { NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { BaseUnitNumber, NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Address, erc20Abi } from 'viem'
import { Config as WagmiConfig } from 'wagmi'
import { getBalance, readContract } from 'wagmi/actions'
import { TokenConfig } from './types'

export interface CreateAssetDataFetcherParams {
  wagmiConfig: WagmiConfig
  tokenConfig: TokenConfig
  account: Address
  nativeAssetInfo: NativeAssetInfo
}

export interface AssetData {
  balance: NormalizedUnitNumber
  decimals: number
  symbol: TokenSymbol
  name: string
}

export function createAssetDataFetcher({
  tokenConfig,
  wagmiConfig,
  account,
  nativeAssetInfo,
}: CreateAssetDataFetcherParams) {
  if (tokenConfig.address === NATIVE_ASSET_MOCK_ADDRESS) {
    return () => getNativeAssetData({ wagmiConfig, nativeAssetInfo, account })
  }

  return () => getERC20Data({ wagmiConfig, tokenConfig, account })
}

interface GetNativeAssetDataParams {
  wagmiConfig: WagmiConfig
  nativeAssetInfo: NativeAssetInfo
  account: Address
}

async function getNativeAssetData({
  wagmiConfig,
  nativeAssetInfo,
  account,
}: GetNativeAssetDataParams): Promise<AssetData> {
  const { decimals, value: balance } = await getBalance(wagmiConfig, {
    address: account,
  })

  return {
    balance: NormalizedUnitNumber(BaseUnitNumber(balance).shiftedBy(-decimals)),
    decimals,
    symbol: nativeAssetInfo.nativeAssetSymbol,
    name: nativeAssetInfo.nativeAssetName,
  }
}

interface GetERC20DataParams {
  wagmiConfig: WagmiConfig
  tokenConfig: TokenConfig
  account: Address
}

async function getERC20Data({ wagmiConfig, tokenConfig, account }: GetERC20DataParams): Promise<AssetData> {
  // @note: This helps viem to batch all the requests into one multicall call.
  // For some reason using multicall action prevents the requests from being batched.
  const [balance, decimals, symbol, name] = await Promise.all([
    readContract(wagmiConfig, {
      abi: erc20Abi,
      address: tokenConfig.address,
      functionName: 'balanceOf',
      args: [account],
    }),
    readContract(wagmiConfig, {
      abi: erc20Abi,
      address: tokenConfig.address,
      functionName: 'decimals',
    }),
    readContract(wagmiConfig, {
      abi: erc20Abi,
      address: tokenConfig.address,
      functionName: 'symbol',
    }),
    readContract(wagmiConfig, {
      abi: erc20Abi,
      address: tokenConfig.address,
      functionName: 'name',
    }),
  ])

  return {
    balance: NormalizedUnitNumber(BaseUnitNumber(balance).shiftedBy(-decimals)),
    decimals,
    symbol: TokenSymbol(symbol),
    name,
  }
}
