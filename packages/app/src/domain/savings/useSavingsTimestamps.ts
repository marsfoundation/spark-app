import { QueryKey, queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { parseAbi } from 'viem'
import { Config, useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { useSandboxState } from '../sandbox/useSandboxState'

export interface SavingsTimestampsQueryOptionsParams {
  wagmiConfig: Config
  chainId: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function savingsTimestampsQueryOptions({ wagmiConfig, chainId }: SavingsTimestampsQueryOptionsParams) {
  return queryOptions({
    queryKey: getSavingsTimestampsQueryKey({ chainId }),
    queryFn: async () => {
      // Cannot be getBlock because of tenderly
      const [uiTimestamp, simulationTimestamp] = await Promise.all([
        readContract(wagmiConfig, {
          address: '0xcA11bde05977b3631167028862bE2a173976CA11',
          abi: parseAbi(['function getCurrentBlockTimestamp() public view returns (uint256 timestamp)']),
          functionName: 'getCurrentBlockTimestamp',
          chainId,
          blockTag: 'pending',
        }),
        readContract(wagmiConfig, {
          address: '0xcA11bde05977b3631167028862bE2a173976CA11',
          abi: parseAbi(['function getCurrentBlockTimestamp() public view returns (uint256 timestamp)']),
          functionName: 'getCurrentBlockTimestamp',
          chainId,
        }),
      ])

      return {
        uiTimestamp: Number(uiTimestamp),
        simulationTimestamp: Number(simulationTimestamp),
      }
    },
  })
}

export function getSavingsTimestampsQueryKey({ chainId }: { chainId: number }): QueryKey {
  return ['savings-timestamps', chainId]
}

export interface UseSavingsTimestampsResult {
  uiTimestamp: number
  simulationTimestamp: number
  isFetching: boolean
  refresh: () => void
}

export function useSavingsTimestamps({ chainId }: { chainId: number }): UseSavingsTimestampsResult {
  const wagmiConfig = useConfig()
  const { isInSandbox } = useSandboxState()

  const {
    data: timestamps,
    isFetching,
    refetch,
  } = useSuspenseQuery({
    ...savingsTimestampsQueryOptions({ wagmiConfig, chainId }),
  })

  // If not in sandbox, max difference should be 60 seconds
  const uiTimestamp = isInSandbox
    ? timestamps.uiTimestamp
    : Math.min(timestamps.uiTimestamp, timestamps.simulationTimestamp + 60)
  const simulationTimestamp = timestamps.simulationTimestamp - 1 // 1 second buffer to mitigate potential calculation issues

  return {
    uiTimestamp,
    simulationTimestamp,
    isFetching,
    refresh: refetch,
  }
}
