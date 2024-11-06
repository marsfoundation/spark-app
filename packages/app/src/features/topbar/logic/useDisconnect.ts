import { UseMutationResult, useMutation } from '@tanstack/react-query'
import { mainnet } from 'viem/chains'
import { useAccount, useDisconnect as useWagmiDisconnect } from 'wagmi'

export interface useDisconnectArgs {
  changeNetworkAsync: (chainId: number) => Promise<void>
  deleteSandbox: () => void
  isInSandbox: boolean
}

export type UseDisconnectResult = Omit<UseMutationResult<void, Error, void, unknown>, 'mutate' | 'mutateAsync'> & {
  disconnect: () => void
  disconnectAsync: () => Promise<void>
}

export function useDisconnect({
  changeNetworkAsync,
  deleteSandbox,
  isInSandbox,
}: useDisconnectArgs): UseDisconnectResult {
  const { disconnectAsync } = useWagmiDisconnect()
  const { connector } = useAccount()

  async function disconnect(): Promise<void> {
    if (!isInSandbox) {
      await disconnectAsync()
      return
    }

    // change the network back to mainnet
    await changeNetworkAsync(mainnet.id)
    // the connector should be the sandbox connector
    await disconnectAsync({
      connector,
    })
    deleteSandbox()
  }

  const mutation = useMutation({
    mutationFn: disconnect,
  })

  return {
    ...mutation,
    disconnect,
    disconnectAsync,
  }
}
