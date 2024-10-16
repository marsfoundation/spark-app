import { dssPsmLiteConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes } from '@/domain/hooks/useWrite'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getBalancesQueryKeyPrefix } from '@/domain/wallet/getBalancesQueryKeyPrefix'
import { ActionConfig, ActionContext } from '@/features/actions/logic/types'
import { assert } from '@/utils/assert'
import { toBigInt } from '@/utils/bigNumber'
import { allowanceQueryKey } from '../../approve/logic/query'
import { DaiPsmConvertAction } from '../types'

export function createDaiPsmConvertActionConfig(action: DaiPsmConvertAction, context: ActionContext): ActionConfig {
  const { account, chainId, tokensInfo } = context
  assert(tokensInfo, 'Tokens info is required for psm convert action')
  const usdc = tokensInfo.findOneTokenBySymbol(TokenSymbol('USDC'))

  return {
    getWriteConfig: () => {
      const usdcAmount = toBigInt(usdc.toBaseUnit(action.amount))

      return ensureConfigTypes({
        address: getContractAddress(dssPsmLiteConfig.address, chainId),
        abi: dssPsmLiteConfig.abi,
        functionName: action.outToken.symbol === usdc.symbol ? 'buyGem' : 'sellGem',
        args: [account, usdcAmount],
      })
    },

    invalidates: () => {
      return [
        allowanceQueryKey({
          token: action.inToken.address,
          spender: getContractAddress(dssPsmLiteConfig.address, chainId),
          account,
          chainId,
        }),
        getBalancesQueryKeyPrefix({ account, chainId }),
      ]
    },
  }
}
