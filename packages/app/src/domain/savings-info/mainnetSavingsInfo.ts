import { susdsAbi } from '@/config/abis/susdsAbi'
import { getChainConfigEntry } from '@/config/chain'
import { SavingsInfoQuery } from '@/config/chain/types'
import { potAbi, potAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@marsfoundation/common-universal'
import { raise } from '@marsfoundation/common-universal'
import { multicall } from 'wagmi/actions'
import { TokenSymbol } from '../types/TokenSymbol'
import { PotSavingsInfo } from './potSavingsInfo'
import { SavingsInfoQueryOptions, SavingsInfoQueryParams } from './types'

export function mainnetSavingsDaiInfoQuery({
  wagmiConfig,
  timestamp,
  chainId,
}: SavingsInfoQueryParams): SavingsInfoQueryOptions {
  const makerPotAddress = getContractAddress(potAddress, chainId)
  return {
    queryKey: ['savings-dai-info', { chainId }],
    queryFn: async () => {
      const [dsr, rho, chi] = await multicall(wagmiConfig, {
        allowFailure: false,
        contracts: [
          {
            address: makerPotAddress,
            functionName: 'dsr',
            args: [],
            abi: potAbi,
          },
          {
            address: makerPotAddress,
            functionName: 'rho',
            args: [],
            abi: potAbi,
          },
          {
            address: makerPotAddress,
            functionName: 'chi',
            args: [],
            abi: potAbi,
          },
        ],
      })

      return new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify(dsr),
          rho: bigNumberify(rho),
          chi: bigNumberify(chi),
        },
        currentTimestamp: timestamp,
      })
    },
  }
}

export const mainnetSavingsUsdsInfoQuery = mainnetSkySavingsInfoQueryFactory(TokenSymbol('sUSDS'))
export const mainnetSavingsUsdcInfoQuery = mainnetSkySavingsInfoQueryFactory(TokenSymbol('sUSDC'))

function mainnetSkySavingsInfoQueryFactory(savingsTokenSymbol: TokenSymbol): SavingsInfoQuery {
  return function mainnetSkySavingsInfoQuery({
    wagmiConfig,
    timestamp,
    chainId,
  }: SavingsInfoQueryParams): SavingsInfoQueryOptions {
    return {
      queryKey: ['savings-info', savingsTokenSymbol, { chainId }],
      queryFn: async () => {
        const chainConfig = getChainConfigEntry(chainId)
        const savingsTokenAddress =
          chainConfig.extraTokens.find(({ symbol }) => symbol === savingsTokenSymbol)?.address ??
          raise(`${savingsTokenSymbol} address not found`)

        const [ssr, rho, chi] = await multicall(wagmiConfig, {
          allowFailure: false,
          contracts: [
            {
              address: savingsTokenAddress,
              functionName: 'ssr',
              args: [],
              abi: susdsAbi,
            },
            {
              address: savingsTokenAddress,
              functionName: 'rho',
              args: [],
              abi: susdsAbi,
            },
            {
              address: savingsTokenAddress,
              functionName: 'chi',
              args: [],
              abi: susdsAbi,
            },
          ],
        })

        return new PotSavingsInfo({
          potParams: {
            dsr: bigNumberify(ssr),
            rho: bigNumberify(rho),
            chi: bigNumberify(chi),
          },
          currentTimestamp: timestamp,
        })
      },
    }
  }
}
