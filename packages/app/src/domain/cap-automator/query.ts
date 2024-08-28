import { queryOptions } from '@tanstack/react-query'
import { Config } from 'wagmi'
import { Token } from '../types/Token'
import { CapAutomatorInfo, CapConfig } from './types'
import { readContract } from 'wagmi/actions'
import { capAutomatorAbi } from '@/config/abis/capAutomatorAbi'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assert } from '@/utils/assert'
import { getChainConfigEntry } from '@/config/chain'

interface CapAutomatorParams {
  wagmiConfig: Config
  chainId: number
  token: Token
}

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

      const automatorParams = {
        address: capAutomatorAddress,
        args: [token.address],
        abi: capAutomatorAbi,
      } as const

      const caps = await Promise.all([
        readContract(wagmiConfig, {
          ...automatorParams,
          functionName: 'supplyCapConfigs',
        }),
        readContract(wagmiConfig, {
          ...automatorParams,
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
  if (capStruct.every((v) => v === 0)) {
    return null
  }

  const [max, gap, increaseCooldown, lastUpdateBlock, lastIncreaseTime] = capStruct

  return {
    maxCap: NormalizedUnitNumber(max),
    gap: NormalizedUnitNumber(gap),
    increaseCooldown,
    lastUpdateBlock: lastUpdateBlock,
    lastIncreaseTime: new Date(lastIncreaseTime * 1000),
  }
}

export function capAutomatorQueryKey({ token, chainId }: Omit<CapAutomatorParams, 'wagmiConfig'>): unknown[] {
  return ['cap-automator', chainId, token]
}
