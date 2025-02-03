import { susdsAbi } from '@/config/abis/susdsAbi'
import { getChainConfigEntry } from '@/config/chain'
import { SavingsConverterQuery } from '@/config/chain/types'
import { potAbi, potAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@marsfoundation/common-universal'
import { raise } from '@marsfoundation/common-universal'
import { multicall } from 'wagmi/actions'
import { TokenSymbol } from '../types/TokenSymbol'
import { PotSavingsConverter } from './PotSavingsConverter'
import { SavingsConverterQueryOptions, SavingsConverterQueryParams } from './types'

export function mainnetSavingsDaiInfoQuery({
  wagmiConfig,
  timestamp,
  chainId,
}: SavingsConverterQueryParams): SavingsConverterQueryOptions {
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

      return new PotSavingsConverter({
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

export const mainnetSavingsUsdsInfoQuery = mainnetSkySavingsConverterQueryFactory(TokenSymbol('sUSDS'))
export const mainnetSavingsUsdcInfoQuery = mainnetSkySavingsConverterQueryFactory(TokenSymbol('sUSDC'))

function mainnetSkySavingsConverterQueryFactory(savingsTokenSymbol: TokenSymbol): SavingsConverterQuery {
  return function mainnetSkySavingsConverterQuery({
    wagmiConfig,
    timestamp,
    chainId,
  }: SavingsConverterQueryParams): SavingsConverterQueryOptions {
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

        return new PotSavingsConverter({
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
