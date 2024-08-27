import { queryOptions } from '@tanstack/react-query'
import { Config } from 'wagmi'
import { Token } from '../../types/Token'
import { mainnet } from 'viem/chains'
import { CapAutomatorInfo, CapConfig } from './types'
import { readContract } from 'wagmi/actions'
import { capAutomatorAbi } from '@/config/abis/capAutomatorAbi'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

interface CapAutomatorParams {
  wagmiConfig: Config
  chainId: number
  token: Token
}

// TODO wagmi cli not working so its temporary
export const capAutomatorAddress = {
  1: '0x2276f52afba7Cf2525fd0a050DF464AC8532d0ef',
} as const

export const capAutomatorConfig = {
  address: capAutomatorAddress,
  abi: capAutomatorAbi,
} as const

export function capAutomatorQueryOptions({ token, wagmiConfig, chainId }: CapAutomatorParams) {
  return queryOptions<CapAutomatorInfo>({
    queryKey: capAutomatorQueryKey({ token, chainId }),
    queryFn: async () => {
      if (chainId !== mainnet.id) {
        return {
          supplyCap: null,
          borrowCap: null,
        }
      }

      const automatorParams = {
        address: getContractAddress(capAutomatorConfig.address, chainId),
        args: [token.address],
        abi: capAutomatorConfig.abi,
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

      // @note typescript infers null as undefined | null which cause type error
      const [supplyCap, borrowCap] = caps.map(formatCapStructToConfig) as [CapConfig | null, CapConfig | null]

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
