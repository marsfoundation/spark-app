import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { CreateConnectorFn } from 'wagmi'

import { createMockConnector } from '@/domain/wallet/createMockConnector'

export interface CreateSandboxWalletArgs {
  privateKey: `0x${string}`
  forkUrl: string
  chainName: string
  chainId: number
}

export function createSandboxConnector({
  privateKey,
  forkUrl,
  chainId,
  chainName,
}: CreateSandboxWalletArgs): CreateConnectorFn {
  const account = privateKeyToAccount(privateKey)

  const walletClient = createWalletClient({
    transport: http(forkUrl),
    chain: {
      ...mainnet,
      id: chainId,
      name: chainName,
      rpcUrls: {
        default: {
          http: [forkUrl],
        },
      },
    },
    account,
  })

  return createMockConnector(walletClient)
}
