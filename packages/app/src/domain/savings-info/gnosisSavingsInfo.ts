import { gnosis } from 'viem/chains'
import { multicall } from 'wagmi/actions'

import {
  savingsXDaiAbi,
  savingsXDaiAdapterAbi,
  savingsXDaiAdapterAddress,
  savingsXDaiAddress,
} from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@/utils/bigNumber'

import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { QueryKey } from '@tanstack/react-query'
import { Config } from 'wagmi'
import { fromWad } from '@/utils/math'
import { Savings } from './types'

export interface GnosisSavingsInfoParams {
  wagmiConfig: Config
  timestamp: number
}

export interface GnosisSavingsInfoResult {
  vaultAPY: Percentage
  totalSupply: NormalizedUnitNumber
  totalAssets: NormalizedUnitNumber
}

export interface GnosisSavingsInfoQueryOptions {
  queryKey: QueryKey
  queryFn: () => Promise<Savings>
}

export function gnosisSavingsInfo({ wagmiConfig, timestamp }: GnosisSavingsInfoParams): GnosisSavingsInfoQueryOptions {
  const sDaiAdapterAddress = getContractAddress(savingsXDaiAdapterAddress, gnosis.id)
  const sDaiAddress = getContractAddress(savingsXDaiAddress, gnosis.id)
  return {
    queryKey: ['gnosis-savings-info'],
    queryFn: async () => {
      const [vaultAPY, totalAssets, totalSupply, decimals] = await multicall(wagmiConfig, {
        contracts: [
          {
            address: sDaiAdapterAddress,
            functionName: 'vaultAPY',
            args: [],
            abi: savingsXDaiAdapterAbi,
          },
          {
            address: sDaiAddress,
            functionName: 'totalSupply',
            args: [],
            abi: savingsXDaiAbi,
          },
          {
            address: sDaiAddress,
            functionName: 'totalAssets',
            args: [],
            abi: savingsXDaiAbi,
          },
          {
            address: sDaiAddress,
            functionName: 'decimals',
            args: [],
            abi: savingsXDaiAbi,
          },
        ],
        allowFailure: false,
      })

      return new GnosisSavings({
        vaultAPY: Percentage(fromWad(bigNumberify(vaultAPY))),
        totalAssets: NormalizedUnitNumber(bigNumberify(totalAssets).shiftedBy(-decimals)),
        totalSupply: NormalizedUnitNumber(bigNumberify(totalSupply).shiftedBy(-decimals)),
        currentTimestamp: timestamp,
      })
    },
  }
}

interface GnosisSavingsParams {
  vaultAPY: Percentage
  totalSupply: NormalizedUnitNumber
  totalAssets: NormalizedUnitNumber
  currentTimestamp: number
}

class GnosisSavings implements Savings {
  private vaultAPY: Percentage
  private totalSupply: NormalizedUnitNumber
  private totalAssets: NormalizedUnitNumber
  private currentTimestamp: number

  constructor(params: GnosisSavingsParams) {
    this.vaultAPY = params.vaultAPY
    this.totalSupply = params.totalSupply
    this.totalAssets = params.totalAssets
    this.currentTimestamp = params.currentTimestamp
  }

  apy(): Percentage {
    return this.vaultAPY
  }

  convertDaiToSDai({ sdai }: { sdai: NormalizedUnitNumber }): NormalizedUnitNumber {
    return NormalizedUnitNumber(sdai.multipliedBy(this.totalSupply.plus(1)).dividedBy(this.totalAssets.plus(1)))
  }

  convertSDaiToDai({ dai }: { dai: NormalizedUnitNumber }): NormalizedUnitNumber {
    return NormalizedUnitNumber(dai.multipliedBy(this.totalAssets.plus(1)).dividedBy(this.totalSupply.plus(1)))
  }

  predictSDaiValue({ timestamp, sdai }: { timestamp: number; sdai: NormalizedUnitNumber }): NormalizedUnitNumber {
    return NormalizedUnitNumber(
      sdai.multipliedBy(
        this.vaultAPY
          .dividedBy(365 * 24 * 60 * 60)
          .multipliedBy(timestamp - this.currentTimestamp)
          .plus(1),
      ),
    )
  }

  get supportsRealTimeInterestAccrual(): boolean {
    return false
  }
}
