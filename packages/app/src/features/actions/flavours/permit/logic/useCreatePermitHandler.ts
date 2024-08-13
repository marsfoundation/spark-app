import { useConnectedAddress } from '@/domain/wallet/useConnectedAddress'
import { PermitStore } from '@/features/actions/logic/permits'
import { ActionHandler, ActionHandlerState } from '@/features/actions/logic/types'
import { parseWriteErrorMessage } from '@/features/actions/logic/utils'
import { JSONStringifyRich } from '@/utils/object'
import { useTimestamp } from '@/utils/useTimestamp'
import { MutationKey, UseQueryResult, useMutation, useQuery } from '@tanstack/react-query'
import { hexToSignature } from 'viem'
import { UseSignTypedDataParameters, UseSignTypedDataReturnType, useChainId, useConfig } from 'wagmi'
import { signTypedDataMutationOptions } from 'wagmi/query'
import { PermitAction } from '../types'
import { getSignPermitDataConfig } from './getSignPermitDataConfig'
import { nameQuery, nonceQuery } from './queries'

export interface UseCreatePermitHandlerOptions {
  enabled: boolean
  permitStore: PermitStore | undefined
}

export function useCreatePermitHandler(
  action: PermitAction,
  { enabled, permitStore }: UseCreatePermitHandlerOptions,
): ActionHandler {
  const { account } = useConnectedAddress()

  const chainId = useChainId()
  const wagmiConfig = useConfig()

  const name = useQuery({
    ...nameQuery({
      wagmiConfig,
      token: action.token.address,
      chainId,
    }),
    enabled,
  })
  const nonce = useQuery({
    ...nonceQuery({
      wagmiConfig,
      token: action.token.address,
      account,
      chainId,
    }),
    enabled,
    gcTime: 0,
  })
  const deadline = useTimestamp().timestamp + 60 * 60 * 24 // 24 hours

  const signDataConfig =
    name.data !== undefined && nonce.data !== undefined
      ? getSignPermitDataConfig({
          token: action.token,
          value: action.value,
          spender: action.spender,
          account,
          deadline,
          chainId,
          contractName: name.data,
          nonce: nonce.data,
        })
      : undefined

  const sign = useSignTypedData({
    mutation: {
      onSuccess: (data) => {
        if (data) {
          const signature = hexToSignature(data)

          if (!permitStore) {
            // this can happen if the user switches to approvals after the sign request was sent, but then signs it anyway.
            return
          }

          permitStore.add({
            token: action.token,
            deadline: new Date(deadline * 1000),
            signature,
          })
        }
      },
    },
    mutationKey: getSignTypedDataMutationKey(signDataConfig),
  })

  return {
    action,
    state: mapStatusesToActionState({ sign, nonce, name, enabled }),
    onAction: () => {
      signDataConfig && sign.signTypedData(signDataConfig)
    },
  }
}

interface MapStatusesToActionStateArgs {
  nonce: UseQueryResult<bigint, Error>
  name: UseQueryResult<string, Error>
  sign: ReturnType<typeof useSignTypedData>
  enabled: boolean
}
function mapStatusesToActionState({ nonce, name, sign, enabled }: MapStatusesToActionStateArgs): ActionHandlerState {
  if (!enabled) {
    return { status: 'disabled' }
  }

  if (sign.isPending || nonce.isLoading || name.isLoading) {
    return { status: 'loading' }
  }

  if (sign.status === 'error') {
    return { status: 'error', errorKind: 'tx-submission', message: parseWriteErrorMessage(sign.error!) }
  }

  if (nonce.status === 'error') {
    return { status: 'error', message: parseWriteErrorMessage(nonce.error) }
  }

  if (name.status === 'error') {
    return { status: 'error', message: parseWriteErrorMessage(name.error) }
  }

  if (sign.isSuccess) {
    return { status: 'success' }
  }

  return { status: 'ready' }
}

export function useSignTypedData(
  parameters: UseSignTypedDataParameters & { mutationKey?: MutationKey } = {},
): UseSignTypedDataReturnType {
  const { mutation, mutationKey } = parameters

  const config = useConfig(parameters)

  const mutationOptions = signTypedDataMutationOptions(config)
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
    mutationKey,
  })

  type Return = UseSignTypedDataReturnType
  return {
    ...result,
    signTypedData: mutate as Return['signTypedData'],
    signTypedDataAsync: mutateAsync as Return['signTypedDataAsync'],
  }
}

function getSignTypedDataMutationKey(config?: ReturnType<typeof getSignPermitDataConfig>): MutationKey {
  return ['signTypedData', JSONStringifyRich(config)]
}
