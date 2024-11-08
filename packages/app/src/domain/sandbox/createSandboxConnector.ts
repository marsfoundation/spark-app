import { http, createWalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { CreateConnectorFn } from 'wagmi'

import { createMockConnector } from '@/domain/wallet/createMockConnector'
import { lastSepolia } from '@/config/chain/constants'

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
      ...lastSepolia,
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
