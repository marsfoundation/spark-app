import { capAutomatorAbi } from '@/config/abis/capAutomatorAbi'
import { getChainConfigEntry } from '@/config/chain'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assert } from '@/utils/assert'
import { queryOptions } from '@tanstack/react-query'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'
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
      const { capAutomatorAddress } = getChainConfigEntry(chainId)

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
          abi: capAutomatorAbi,
          functionName: 'supplyCapConfigs',
        }),
        readContract(wagmiConfig, {
          address: capAutomatorAddress,
          args: [token.address],
          abi: capAutomatorAbi,
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
  const maxCap = capStruct[0]
  if (maxCap === 0) {
    return null
  }

  const [max, gap, increaseCooldown, lastUpdateBlock, lastIncreaseTime] = capStruct

  return {
    maxCap: NormalizedUnitNumber(max),
    gap: NormalizedUnitNumber(gap),
    increaseCooldown,
    lastUpdateBlock,
    lastIncreaseTime: new Date(lastIncreaseTime * 1000),
  }
}

export function capAutomatorQueryKey({ token, chainId }: Omit<CapAutomatorParams, 'wagmiConfig'>): unknown[] {
  return ['cap-automator', chainId, token.address]
}
