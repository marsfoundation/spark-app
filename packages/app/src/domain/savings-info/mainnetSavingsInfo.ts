import { QueryKey } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { mainnet } from 'viem/chains'
import { Config } from 'wagmi'
import { multicall } from 'wagmi/actions'

import { potAbi, potAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@/utils/bigNumber'
import { fromRay, pow } from '@/utils/math'

import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { SavingsManager } from './types'

export interface MainnetSavingsInfoParams {
  wagmiConfig: Config
  timestamp: number
}

export interface PotParams {
  dsr: BigNumber
  rho: BigNumber
  chi: BigNumber
}

export interface MainnetSavingsInfoResult {
  DSR: Percentage
  potParams: PotParams
}

export interface MainnetSavingsInfoQueryOptions {
  queryKey: QueryKey
  queryFn: () => Promise<SavingsManager>
}

export function mainnetSavingsInfo({
  wagmiConfig,
  timestamp,
}: MainnetSavingsInfoParams): MainnetSavingsInfoQueryOptions {
  const makerPotAddress = getContractAddress(potAddress, mainnet.id)
  return {
    queryKey: ['mainnet-savings-info'],
    queryFn: async () => {
      const [dsr, rho, chi] = await multicall(wagmiConfig, {
        allowFailure: false,
        chainId: mainnet.id,
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

      return new MainnetSavings({
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

export interface MainnetSavingsParams {
  potParams: PotParams
  currentTimestamp: number
}

export class MainnetSavings implements SavingsManager {
  readonly DSR: Percentage
  readonly potParams: PotParams
  readonly currentTimestamp: number

  constructor({ potParams, currentTimestamp }: MainnetSavingsParams) {
    this.potParams = potParams
    this.currentTimestamp = currentTimestamp
    this.DSR = Percentage(pow(fromRay(potParams.dsr), 60 * 60 * 24 * 365).minus(1), true)
  }

  get apy(): Percentage {
    return this.DSR
  }

  get supportsRealTimeInterestAccrual(): boolean {
    return true
  }

  private getUpdatedChi(timestamp: number): BigNumber {
    const { dsr, rho, chi } = this.potParams
    return fromRay(pow(fromRay(dsr), bigNumberify(timestamp).minus(rho)).multipliedBy(chi))
  }

  convertDaiToShares({ dai }: { dai: NormalizedUnitNumber }): NormalizedUnitNumber {
    const updatedChi = this.getUpdatedChi(this.currentTimestamp)
    return NormalizedUnitNumber(dai.dividedBy(updatedChi))
  }

  convertSharesToDai({ shares }: { shares: NormalizedUnitNumber }): NormalizedUnitNumber {
    return this.predictSharesValue({ timestamp: this.currentTimestamp, shares })
  }

  predictSharesValue({ timestamp, shares }: { timestamp: number; shares: NormalizedUnitNumber }): NormalizedUnitNumber {
    const updatedChi = this.getUpdatedChi(timestamp)
    return NormalizedUnitNumber(shares.multipliedBy(updatedChi))
  }
}
