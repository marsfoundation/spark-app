import { capAutomatorConfig } from '@/config/contracts-generated'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assert } from '@/utils/assert'
import { queryOptions } from '@tanstack/react-query'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { getOptionalContractAddress } from '../hooks/useContractAddress'
import { Token } from '../types/Token'
import { CapAutomatorInfo, CapConfig } from './types'

interface CapAutomatorParams {
  wagmiConfig: Config
  chainId: number
  token: Token
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function capAutomatorQueryOptions({ token, wagmiConfig, chainId }: CapAutomatorParams) {
  return queryOptions<CapAutomatorInfo>({
    queryKey: capAutomatorQueryKey({ token, chainId }),
    queryFn: async () => {
      const capAutomatorAddress = getOptionalContractAddress(capAutomatorConfig.address, chainId)

      if (!capAutomatorAddress) {
        return {
          supplyCap: null,
          borrowCap: null,
        }
      }

      const caps = await Promise.all([
        readContract(wagmiConfig, {
          address: capAutomatorAddress,
          args: [token.address],
          abi: capAutomatorConfig.abi,
          functionName: 'supplyCapConfigs',
        }),
        readContract(wagmiConfig, {
          address: capAutomatorAddress,
          args: [token.address],
          abi: capAutomatorConfig.abi,
          functionName: 'borrowCapConfigs',
        }),
      ])

      const [supplyCap, borrowCap] = caps.map(formatCapStructToConfig)

      assert(supplyCap !== undefined && borrowCap !== undefined)

      return {
        supplyCap,
        borrowCap,
      }
    },
  })
}

function formatCapStructToConfig(capStruct: readonly [number, number, number, number, number]): CapConfig | null {
  const [max, gap, increaseCooldown, lastUpdateBlock, lastIncreaseTime] = capStruct

  if (max === 0) {
    return null
  }

  return {
    maxCap: NormalizedUnitNumber(max),
    gap: NormalizedUnitNumber(gap),
    increaseCooldown,
    lastUpdateBlock,
    lastIncreaseTime,
  }
}

export function capAutomatorQueryKey({ token, chainId }: Omit<CapAutomatorParams, 'wagmiConfig'>): unknown[] {
  return ['cap-automator', chainId, token.address]
}
