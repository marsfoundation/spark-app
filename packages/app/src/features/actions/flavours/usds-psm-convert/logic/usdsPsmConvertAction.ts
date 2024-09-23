import { usdsPsmWrapperConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { assert } from '@/utils/assert'
import { toBigInt } from '@/utils/bigNumber'
import { allowanceQueryKey } from '../../approve/logic/query'
import { UsdsPsmConvertAction } from '../types'

export function createUsdsPsmConvertActionConfig(action: UsdsPsmConvertAction, context: ActionContext): ActionConfig {
  const { account, chainId, tokensInfo } = context
  assert(tokensInfo, 'Tokens info is required for psm convert action')
  const usdc = tokensInfo.findOneTokenBySymbol(TokenSymbol('USDC'))

  return {
    getWriteConfig: () => {
      const amount = toBigInt(action.inToken.toBaseUnit(action.amount))

      return ensureConfigTypes({
        address: getContractAddress(usdsPsmWrapperConfig.address, chainId),
        abi: usdsPsmWrapperConfig.abi,
        functionName: action.outToken.symbol === usdc.symbol ? 'buyGem' : 'sellGem',
        args: [account, amount],
      })
    },

    invalidates: () => {
      return [
        allowanceQueryKey({
          token: action.inToken.address,
          spender: getContractAddress(usdsPsmWrapperConfig.address, chainId),
          account,
          chainId,
        }),
        getBalancesQueryKeyPrefix({ account, chainId }),
      ]
    },
  }
}
