import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Address, erc20Abi } from 'viem'
import { Config as WagmiConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { TokenConfig } from './types'

export interface GetERC20DataParams {
  wagmiConfig: WagmiConfig
  tokenConfig: TokenConfig
  account: Address
}

export interface ERC20Data {
  balance: NormalizedUnitNumber
  decimals: number
  symbol: TokenSymbol
  name: string
}

export async function getERC20Data({ wagmiConfig, tokenConfig, account }: GetERC20DataParams): Promise<ERC20Data> {
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
    balance: NormalizedUnitNumber(balance),
    decimals,
    symbol: TokenSymbol(symbol),
    name,
  }
}
