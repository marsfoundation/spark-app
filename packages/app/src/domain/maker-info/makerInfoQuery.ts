import { rayMul } from '@aave/math-utils'
import { stringToHex } from 'viem'
import { Config } from 'wagmi'
import { multicall } from 'wagmi/actions'

import { iamAutoLineAbi, iamAutoLineAddress, vatAbi, vatAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@/utils/bigNumber'
import { fromRad, fromWad } from '@/utils/math'

import { NormalizedUnitNumber } from '../types/NumericValues'
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
  const sparkIlkId = stringToHex('DIRECT-SPARK-DAI', { size: 32 })

  async function queryFn(): Promise<MakerInfo> {
    const [[vatArt, vatRate], [IAMLine]] = await multicall(wagmiConfig, {
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
      ],
    })
    const D3MCurrentDebt = rayMul(bigNumberify(vatArt), bigNumberify(vatRate))
    const D3MCurrentDebtUSD = NormalizedUnitNumber(fromWad(D3MCurrentDebt))
    const maxDebtCeiling = NormalizedUnitNumber(fromRad(bigNumberify(IAMLine)))

    return {
      D3MCurrentDebtUSD,
      maxDebtCeiling,
    }
  }

  return { queryKey, queryFn }
}
