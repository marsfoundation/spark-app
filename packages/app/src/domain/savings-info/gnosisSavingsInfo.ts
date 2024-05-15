import { QueryKey } from '@tanstack/react-query'
import { gnosis } from 'viem/chains'
import { Config } from 'wagmi'
import { multicall } from 'wagmi/actions'

import {
  savingsXDaiAbi,
  savingsXDaiAdapterAbi,
  savingsXDaiAdapterAddress,
  savingsXDaiAddress,
} from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@/utils/bigNumber'
import { fromWad } from '@/utils/math'

import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { SavingsInfo } from './types'

export interface GnosisSavingsInfoQueryParams {
  wagmiConfig: Config
  timestamp: number
}

export interface GnosisSavingsInfoQueryOptions {
  queryKey: QueryKey
  queryFn: () => Promise<SavingsInfo>
}

export function gnosisSavingsInfoQuery({
  wagmiConfig,
  timestamp,
}: GnosisSavingsInfoQueryParams): GnosisSavingsInfoQueryOptions {
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

      return new GnosisSavingsInfo({
        vaultAPY: Percentage(fromWad(bigNumberify(vaultAPY))),
        totalAssets: NormalizedUnitNumber(bigNumberify(totalAssets).shiftedBy(-decimals)),
        totalSupply: NormalizedUnitNumber(bigNumberify(totalSupply).shiftedBy(-decimals)),
        currentTimestamp: timestamp,
      })
    },
  }
}

export interface GnosisSavingsInfoParams {
  vaultAPY: Percentage
  totalSupply: NormalizedUnitNumber
  totalAssets: NormalizedUnitNumber
  currentTimestamp: number
}

export class GnosisSavingsInfo implements SavingsInfo {
  private vaultAPY: Percentage
  private totalSupply: NormalizedUnitNumber
  private totalAssets: NormalizedUnitNumber
  private currentTimestamp: number

  constructor(params: GnosisSavingsInfoParams) {
    this.vaultAPY = params.vaultAPY
    this.totalSupply = params.totalSupply
    this.totalAssets = params.totalAssets
    this.currentTimestamp = params.currentTimestamp
  }

  get apy(): Percentage {
    return this.vaultAPY
  }

  get supportsRealTimeInterestAccrual(): boolean {
    return false
  }

  convertDaiToShares({ dai }: { dai: NormalizedUnitNumber }): NormalizedUnitNumber {
    return NormalizedUnitNumber(dai.multipliedBy(this.totalAssets.plus(1)).dividedBy(this.totalSupply.plus(1)))
  }

  convertSharesToDai({ shares }: { shares: NormalizedUnitNumber }): NormalizedUnitNumber {
    return NormalizedUnitNumber(shares.multipliedBy(this.totalSupply.plus(1)).dividedBy(this.totalAssets.plus(1)))
  }

  predictSharesValue({ timestamp, shares }: { timestamp: number; shares: NormalizedUnitNumber }): NormalizedUnitNumber {
    return NormalizedUnitNumber(
      this.convertSharesToDai({ shares }).multipliedBy(
        this.vaultAPY
          .dividedBy(365 * 24 * 60 * 60)
          .multipliedBy(timestamp - this.currentTimestamp)
          .plus(1),
      ),
    )
  }
}
