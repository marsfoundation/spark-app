import { QueryKey, queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { parseAbi } from 'viem'
import { Config, useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'

export interface nodeTimestampQueryOptionsParams {
  wagmiConfig: Config
  chainId: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function nodeTimestampQueryOptions({ wagmiConfig, chainId }: nodeTimestampQueryOptionsParams) {
  return queryOptions({
    queryKey: getNodeTimestampQueryKey({ chainId }),
    queryFn: async () => {
      // Cannot be getBlock because of tenderly
      const timestamp = await readContract(wagmiConfig, {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        abi: parseAbi(['function getCurrentBlockTimestamp() public view returns (uint256 timestamp)']),
        functionName: 'getCurrentBlockTimestamp',
        chainId,
        blockTag: 'pending',
      })

      return timestamp
    },
  })
}

export function getNodeTimestampQueryKey({ chainId }: { chainId: number }): QueryKey {
  return ['node-time', chainId]
}

export interface UseNodeTimestampResult {
  timestamp: number
  refresh: () => void
}

export function useNodeTimestamp({ chainId }: { chainId: number }): UseNodeTimestampResult {
  const wagmiConfig = useConfig()
  const { data: timestamp, refetch } = useSuspenseQuery({
    ...nodeTimestampQueryOptions({ wagmiConfig, chainId }),
  })
  return {
    timestamp: Number(timestamp),
    refresh: refetch,
  }
}
