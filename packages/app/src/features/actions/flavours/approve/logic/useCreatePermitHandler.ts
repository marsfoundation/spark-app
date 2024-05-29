import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { hexToSignature } from 'viem'
import { useChainId, useConfig, useSignTypedData } from 'wagmi'

import { useConnectedAddress } from '@/domain/wallet/useConnectedAddress'
import { ApproveAction } from '@/features/actions/flavours/approve/types'
import { PermitStore } from '@/features/actions/logic/permits'
import { ActionHandler, ActionHandlerState } from '@/features/actions/logic/types'
import { parseWriteErrorMessage } from '@/features/actions/logic/utils'
import { JSONStringifyRich } from '@/utils/object'
import { useTimestamp } from '@/utils/useTimestamp'

import { getSignPermitDataConfig } from './getSignPermitDataConfig'
import { nameQuery, nonceQuery } from './queries'

export interface UseCreatePermitHandlerOptions {
  enabled: boolean
  permitStore?: PermitStore
}

export function useCreatePermitHandler(
  action: ApproveAction,
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
  const snapshottedSignDataConfigRef = useRef<typeof signDataConfig | undefined>()

  const sign = useSignTypedData({
    mutation: {
      onSuccess: (data) => {
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
      },
    },
  })

  if (
    (sign.isSuccess || sign.isError) &&
    JSONStringifyRich(snapshottedSignDataConfigRef.current) !== JSONStringifyRich(signDataConfig)
  ) {
    snapshottedSignDataConfigRef.current = undefined
    sign.reset()
  }

  return {
    action: {
      ...action,
      type: 'permit',
    },
    state: mapStatusesToActionState({ sign, nonce, name, enabled }),
    onAction: () => {
      snapshottedSignDataConfigRef.current = signDataConfig
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
