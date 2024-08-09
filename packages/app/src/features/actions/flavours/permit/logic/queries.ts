import { queryOptions } from '@tanstack/react-query'
import { Address, erc20Abi, parseAbi } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'

export interface NonceQueryArgs {
  wagmiConfig: Config
  token: Address
  account: Address
  chainId: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function nonceQuery({ wagmiConfig, token, account, chainId }: NonceQueryArgs) {
  return queryOptions({
    queryKey: ['permit', token, account, chainId],
    queryFn: () => {
      return readContract(wagmiConfig, {
        abi: parseAbi(['function nonces(address) view returns (uint256)']),
        address: token,
        functionName: 'nonces',
        args: [account],
      })
    },
  })
}

export interface NameQueryArgs {
  wagmiConfig: Config
  token: Address
  chainId: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function nameQuery({ wagmiConfig, token, chainId }: NameQueryArgs) {
  return queryOptions({
    queryKey: ['name', token, chainId],
    queryFn: () => {
      return readContract(wagmiConfig, {
        abi: erc20Abi,
        address: token,
        functionName: 'name',
      })
    },
  })
}
