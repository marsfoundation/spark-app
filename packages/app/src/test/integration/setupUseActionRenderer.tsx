import { UseContractActionParams, useContractAction } from '@/features/actions/logic/useAction'
import { raise } from '@/utils/assert'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { SetupHookRendererArgs, setupHookRenderer } from './setupHookRenderer'

export function setupUseActionRenderer(defaultArgs: Omit<SetupHookRendererArgs<typeof useActionWrapper>, 'hook'>) {
  return setupHookRenderer({
    ...defaultArgs,
    hook: useActionWrapper,
  })
}

export interface UseActionWrapperParams extends Omit<UseContractActionParams, 'context'> {
  context?: Omit<UseContractActionParams['context'], 'chainId' | 'account' | 'wagmiConfig'>
}

function useActionWrapper({ context, ...rest }: UseActionWrapperParams) {
  const chainId = useChainId()
  const { address } = useAccount()
  const wagmiConfig = useConfig()

  return useContractAction({
    context: {
      chainId,
      account: address ?? raise('account is not defined'),
      wagmiConfig,
      ...context,
    },
    ...rest,
  })
}
