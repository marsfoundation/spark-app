import { rayMul } from '@aave/math-utils'
import BigNumber from 'bignumber.js'
import { stringToHex } from 'viem'
import { Config } from 'wagmi'
import { multicall } from 'wagmi/actions'

import {
  iamAutoLineAbi,
  iamAutoLineAddress,
  potAbi,
  potAddress,
  vatAbi,
  vatAddress,
} from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@/utils/bigNumber'
import { fromRad, fromRay, fromWad } from '@/utils/math'

import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { getIsChainSupported } from './getIsChainSupported'
import { MakerInfo } from './types'

interface MakerInfoQueryParams {
  wagmiConfig: Config
  chainId: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function makerInfoQuery({ wagmiConfig, chainId }: MakerInfoQueryParams) {
  const queryKey = ['maker-info', chainId]

  const isChainSupported = getIsChainSupported(chainId)
  if (!isChainSupported) {
    return { queryKey, queryFn: async () => null }
  }

  const makerVatAddress = getContractAddress(vatAddress, chainId)
  const makerIamAutoLineAddress = getContractAddress(iamAutoLineAddress, chainId)
  const makerPotAddress = getContractAddress(potAddress, chainId)
  const sparkIlkId = stringToHex('DIRECT-SPARK-DAI', { size: 32 })

  async function queryFn(): Promise<MakerInfo> {
    const [[vatArt, vatRate], [IAMLine], dsr, rho, chi] = await multicall(wagmiConfig, {
      allowFailure: false,
      chainId,
      contracts: [
        {
          address: makerVatAddress,
          functionName: 'ilks',
          args: [sparkIlkId],
          abi: vatAbi,
        },
        {
          address: makerIamAutoLineAddress,
          functionName: 'ilks',
          args: [sparkIlkId],
          abi: iamAutoLineAbi,
        },
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
    const D3MCurrentDebt = rayMul(bigNumberify(vatArt), bigNumberify(vatRate))
    const D3MCurrentDebtUSD = NormalizedUnitNumber(fromWad(D3MCurrentDebt))
    const maxDebtCeiling = NormalizedUnitNumber(fromRad(bigNumberify(IAMLine)))
    // DSR is stored as a ray per second, so we need to convert it to a yearly rate
    BigNumber.config({ POW_PRECISION: 100 }) // https://github.com/MikeMcl/bignumber.js/issues/38
    const DSR = Percentage(
      fromRay(bigNumberify(dsr))
        .pow(60 * 60 * 24 * 365)
        .minus(1),
    )

    return {
      D3MCurrentDebtUSD,
      maxDebtCeiling,
      DSR,
      potParameters: {
        dsr: bigNumberify(dsr),
        rho: bigNumberify(rho),
        chi: bigNumberify(chi),
      },
    }
  }

  return { queryKey, queryFn }
}
