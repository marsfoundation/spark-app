import { dssLitePsmConfig, usdsPsmWrapperConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { assert } from '@/utils/assert'
import { assertNever } from '@/utils/assertNever'
import { toBigInt } from '@/utils/bigNumber'
import { QueryKey } from '@tanstack/react-query'
import { allowanceQueryKey } from '../../approve/logic/query'
import { PsmConvertAction } from '../types'
import { getPsmConvertActionPath } from './getPsmConvertActionPath'

export function createPsmConvertActionConfig(action: PsmConvertAction, context: ActionContext): ActionConfig {
  const { account, chainId, tokensInfo } = context
  assert(tokensInfo, 'Tokens info is required for psm convert action')
  const usdc = tokensInfo.findOneTokenBySymbol(TokenSymbol('USDC'))

  const actionPath = getPsmConvertActionPath({
    inToken: action.inToken,
    outToken: action.outToken,
    tokensInfo,
    chainId,
  })

  return {
    getWriteConfig: () => {
      switch (actionPath) {
        case 'usdc-dai':
        case 'dai-usdc': {
          const usdcAmount = toBigInt(usdc.toBaseUnit(action.amount))
          return ensureConfigTypes({
            address: getContractAddress(dssLitePsmConfig.address, chainId),
            abi: dssLitePsmConfig.abi,
            functionName: action.outToken.symbol === usdc.symbol ? 'buyGem' : 'sellGem',
            args: [account, usdcAmount],
          })
        }

        case 'usdc-usds':
        case 'usds-usdc': {
          const usdcAmount = toBigInt(usdc.toBaseUnit(action.amount))
          return ensureConfigTypes({
            address: getContractAddress(usdsPsmWrapperConfig.address, chainId),
            abi: usdsPsmWrapperConfig.abi,
            functionName: action.outToken.symbol === usdc.symbol ? 'buyGem' : 'sellGem',
            args: [account, usdcAmount],
          })
        }
        default:
          assertNever(actionPath)
      }
    },

    invalidates: () => {
      const balancesQueryKeyPrefix = getBalancesQueryKeyPrefix({ chainId, account })
      function getAllowanceQueryKey(spender: CheckedAddress): QueryKey {
        return allowanceQueryKey({ token: action.inToken.address, spender, account, chainId })
      }

      switch (actionPath) {
        case 'usdc-dai':
        case 'dai-usdc':
          return [balancesQueryKeyPrefix, getAllowanceQueryKey(getContractAddress(dssLitePsmConfig.address, chainId))]

        case 'usdc-usds':
        case 'usds-usdc':
          return [
            balancesQueryKeyPrefix,
            getAllowanceQueryKey(getContractAddress(usdsPsmWrapperConfig.address, chainId)),
          ]

        default:
          assertNever(actionPath)
      }
    },
  }
}
