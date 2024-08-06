import { NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { ensureConfigTypes, useWrite } from '@/domain/hooks/useWrite'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { allowance, allowanceQueryKey } from '@/domain/market-operations/allowance/query'
import { normalizeErc20AbiForToken } from '@/domain/market-operations/normalizeErc20Abi'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { toBigInt } from '@/utils/bigNumber'
import { QueryKey, UseQueryOptions, UseQueryResult, queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { ApproveAction } from '../types'

export interface ActionContext {
  marketInfo?: MarketInfo
  tokensInfo?: TokensInfo
  wagmiConfig: Config
  account: Address
  chainId: number
  enabled: boolean
}

type FetchActionDataQueryOptions = UseQueryOptions<any, Error, { canBeSkipped: boolean }, QueryKey>
export type FetchActionDataResult = UseQueryResult<{ canBeSkipped: boolean }>
type VerifyTransactionQueryOptions = UseQueryOptions<any, Error, { success: boolean }, QueryKey>
export type VerifyTransactionResult = UseQueryResult<{ success: boolean }>

export interface ActionConfig {
  actionDataQueryOptions: () => FetchActionDataQueryOptions
  getWriteConfig: (actionData: FetchActionDataResult) => Parameters<typeof useWrite>[0]
  verifyTransactionQueryOptions: () => VerifyTransactionQueryOptions
  invalidates: () => QueryKey[]
  beforeWriteCheck?: () => {}
}

export interface CreateApproveActionConfigParams {
  action: ApproveAction
}

export function createApproveActionConfig(action: ApproveAction, context: ActionContext): ActionConfig {
  const { wagmiConfig, account, chainId, enabled } = context

  return {
    actionDataQueryOptions: () => {
      return queryOptions({
        ...allowance({
          token: action.token.address,
          spender: action.spender,
          wagmiConfig,
          account,
          chainId,
        }),
        enabled: context.enabled,
        select: (data) => ({ canBeSkipped: data >= toBigInt(action.token.toBaseUnit(action.value)) }),
      })
    },

    getWriteConfig: () => {
      const value = toBigInt(action.token.toBaseUnit(action.value))
      const token = action.token.address

      const baseConfig = ensureConfigTypes({
        address: token,
        abi: normalizeErc20AbiForToken(chainId, token),
        functionName: 'approve',
        args: [action.spender, value],
      })

      return {
        ...baseConfig,
        enabled: value > 0n && token !== NATIVE_ASSET_MOCK_ADDRESS && enabled,
      }
    },

    verifyTransactionQueryOptions: () => {
      return queryOptions({
        ...allowance({
          token: action.token.address,
          spender: action.spender,
          wagmiConfig,
          account,
          chainId,
        }),
        enabled: context.enabled,
        select: (data) => ({ success: data >= toBigInt(action.token.toBaseUnit(action.value)) }),
      })
    },

    invalidates: () => [allowanceQueryKey({ token: action.token.address, spender: action.spender, account, chainId })],
  }
}
