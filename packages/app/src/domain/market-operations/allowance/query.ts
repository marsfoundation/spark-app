import { queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'

import { MAX_INT, NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'

import { normalizeErc20AbiForToken } from '../normalizeErc20Abi'

export interface AllowanceOptions {
  wagmiConfig: Config
  token: Address
  spender: Address
  account: Address
  chainId: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function allowance({ wagmiConfig, token, spender, account, chainId }: AllowanceOptions) {
  return queryOptions<bigint>({
    queryKey: [
      {
        entity: 'readContract',
        functionName: 'allowance',
        address: token,
        args: [account, spender],
        chainId,
      },
    ],
    queryFn: () => {
      if (token === NATIVE_ASSET_MOCK_ADDRESS) {
        return MAX_INT
      }

      return readContract(wagmiConfig, {
        functionName: 'allowance',
        address: token,
        abi: normalizeErc20AbiForToken(chainId, token),
        args: [account, spender],
      })
    },
  })
}
