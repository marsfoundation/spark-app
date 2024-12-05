import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { BaseUnitNumber, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { Address, erc20Abi, zeroAddress } from 'viem'
import { Config as WagmiConfig } from 'wagmi'
import { getBalance, readContract } from 'wagmi/actions'
import { TokenConfig } from './types'

export interface CreateAssetDataFetcherParams {
  wagmiConfig: WagmiConfig
  tokenConfig: TokenConfig
  account: Address | undefined
  chainId: number
}

export interface AssetData {
  balance: NormalizedUnitNumber
  decimals: number
  symbol: TokenSymbol
  name: string
}

export function createAssetDataFetcher({ tokenConfig, wagmiConfig, account, chainId }: CreateAssetDataFetcherParams) {
  if (tokenConfig.address === NATIVE_ASSET_MOCK_ADDRESS) {
    return () => getNativeAssetData({ wagmiConfig, chainId, account })
  }

  return () => getERC20Data({ wagmiConfig, tokenConfig, chainId, account })
}

interface GetNativeAssetDataParams {
  wagmiConfig: WagmiConfig
  chainId: number
  account: Address | undefined
}

async function getNativeAssetData({ wagmiConfig, chainId, account }: GetNativeAssetDataParams): Promise<AssetData> {
  // if account is undefined, read balance for zero address to extract decimals
  const { decimals, value: balance } = await getBalance(wagmiConfig, {
    address: account ?? zeroAddress,
    chainId,
  })
  const nativeAssetInfo = getNativeAssetInfo(chainId)

  return {
    // if account is undefined, the balance is 0
    balance: NormalizedUnitNumber(BaseUnitNumber(account ? balance : 0).shiftedBy(-decimals)),
    decimals,
    symbol: nativeAssetInfo.nativeAssetSymbol,
    name: nativeAssetInfo.nativeAssetName,
  }
}

interface GetERC20DataParams {
  wagmiConfig: WagmiConfig
  tokenConfig: TokenConfig
  chainId: number
  account: Address | undefined
}

async function getERC20Data({ wagmiConfig, chainId, tokenConfig, account }: GetERC20DataParams): Promise<AssetData> {
  function getBalance(): Promise<bigint> {
    if (!account) {
      return Promise.resolve(0n)
    }

    return readContract(wagmiConfig, {
      abi: erc20Abi,
      address: tokenConfig.address,
      functionName: 'balanceOf',
      args: [account],
      chainId,
    })
  }

  // @note: This helps viem to batch all the requests into one multicall call.
  // For some reason using multicall action prevents the requests from being batched.
  const [balance, decimals, symbol, name] = await Promise.all([
    getBalance(),
    readContract(wagmiConfig, {
      abi: erc20Abi,
      address: tokenConfig.address,
      functionName: 'decimals',
      chainId,
    }),
    readContract(wagmiConfig, {
      abi: erc20Abi,
      address: tokenConfig.address,
      functionName: 'symbol',
      chainId,
    }),
    readContract(wagmiConfig, {
      abi: erc20Abi,
      address: tokenConfig.address,
      functionName: 'name',
      chainId,
    }),
  ])

  return {
    balance: NormalizedUnitNumber(BaseUnitNumber(balance).shiftedBy(-decimals)),
    decimals,
    symbol: TokenSymbol(symbol),
    name,
  }
}
