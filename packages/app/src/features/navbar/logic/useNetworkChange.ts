import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { useChainId, useConnect, useConnections, useDisconnect, useSwitchAccount, useSwitchChain } from 'wagmi'

import { createSandboxConnector } from '@/domain/sandbox/createSandboxConnector'
import { useStore } from '@/domain/state'

export type UseNetworkChangeResult = Omit<UseMutationResult<void, Error, number, unknown>, 'mutate' | 'mutateAsync'> & {
  changeNetwork: (chainId: number) => void
  changeNetworkAsync: (chainId: number) => Promise<void>
}

export function useNetworkChange(): UseNetworkChangeResult {
  const { switchChainAsync } = useSwitchChain()
  const { switchAccountAsync } = useSwitchAccount()
  const { disconnectAsync } = useDisconnect()
  const { connectAsync } = useConnect()

  const currentChainId = useChainId()
  const connections = useConnections()
  const sandboxNetwork = useStore((state) => state.sandbox.network)

  async function changeNetwork(chainId: number): Promise<void> {
    const sandboxChainId = sandboxNetwork?.forkChainId

    // switching to sandbox
    if (chainId === sandboxChainId) {
      const sandboxConnection = connections.find((connection) => connection.chainId === sandboxChainId)
      if (!sandboxConnection) {
        if (!sandboxNetwork?.ephemeralAccountPrivateKey) {
          throw new Error('Sandbox network is not set up')
        }

        await connectAsync({
          chainId: sandboxChainId,
          connector: createSandboxConnector({
            chainId: sandboxChainId,
            chainName: sandboxNetwork.name,
            forkUrl: sandboxNetwork.forkUrl,
            privateKey: sandboxNetwork.ephemeralAccountPrivateKey,
          }),
        })
        return
      }

      await switchAccountAsync({
        connector: sandboxConnection.connector,
      })
      return
    }

    // switching from sandbox
    if (currentChainId === sandboxChainId) {
      const sandboxConnection = connections.find((connection) => connection.chainId === sandboxChainId)

      const targetConnection =
        connections.find((connection) => connection.chainId === chainId) ??
        connections.filter((connection) => connection.chainId !== sandboxChainId)[0]

      // sandbox is the only connection
      if (!targetConnection) {
        await disconnectAsync({
          connector: sandboxConnection?.connector,
        })
        await switchChainAsync({
          chainId,
        })
        return
      }

      if (targetConnection.chainId !== chainId) {
        try {
          // try to switch to the target chain for the target connector
          await switchChainAsync({
            chainId,
            connector: targetConnection.connector,
          })
        } catch {
          // didn't manage to switch to the target chain, disconnect the sandbox wallet
          await disconnectAsync({
            connector: sandboxConnection?.connector,
          })
          await switchChainAsync({
            chainId,
          })
          return
        }
      }

      await switchAccountAsync({
        connector: targetConnection.connector,
      })
      return
    }

    // switching when neither current nor target chain is sandbox
    await switchChainAsync({
      chainId,
    })
  }

  const mutation = useMutation({
    mutationFn: changeNetwork,
  })

  return {
    changeNetwork: mutation.mutate,
    changeNetworkAsync: mutation.mutateAsync,
    ...mutation,
  }
}
