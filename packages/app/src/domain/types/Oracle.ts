import { fromWad } from '@/utils/math'
import { erc4626Abi, parseEther } from 'viem'
import { CheckedAddress } from './CheckedAddress'
import { NormalizedUnitNumber } from './NumericValues'

export type OracleType = 'fixed-usd' | 'pot-dai'

// export interface Oracle {
//   type: OracleType
//   oracleContractCalls: unknown[]
//   getTokenUnitPriceUsd: (oracleContractCallsResult: unknown[]) => string
// }

// export class FixedUsdOracle implements Oracle {
//   readonly type = 'fixed-usd'
//   readonly oracleContractCalls = []
//   readonly getTokenUnitPriceUsd = () => '1'
// }

// export class PotDaiOracle implements Oracle {
//   readonly type = 'pot-dai'
//   readonly oracleContractCalls: unknown[]

//   constructor(tokenAddress: CheckedAddress) {
//     this.oracleContractCalls = [
//       {
//         address: tokenAddress,
//         functionName: 'convertToAssets',
//         args: [parseEther('10')],
//         abi: erc4626Abi,
//       },
//     ]
//   }

//   getTokenUnitPriceUsd(oracleContractCallsResult: unknown[]): string {
//     const price = NormalizedUnitNumber(oracleContractCallsResult[0] as bigint)
//     return NormalizedUnitNumber(fromWad(price)).toFixed()
//   }
// }

export function getOracleContractCalls(oracleType: OracleType, tokenAddress: CheckedAddress) {
  switch (oracleType) {
    case 'fixed-usd':
      return []
    case 'pot-dai':
      return [
        {
          address: tokenAddress,
          functionName: 'convertToAssets',
          args: [parseEther('1')],
          abi: erc4626Abi,
        },
      ]
  }
}

export function getTokenUnitPriceUsd(oracleType: OracleType, oracleContractCallsResult: unknown[]): string {
  switch (oracleType) {
    case 'fixed-usd':
      return '1'
    case 'pot-dai': {
      const price = NormalizedUnitNumber(oracleContractCallsResult[0] as bigint)
      return NormalizedUnitNumber(fromWad(price)).toFixed()
    }
  }
}
