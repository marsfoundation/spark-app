import { Account, Chain, Transport, WalletClient } from 'viem'
import { createConnector, CreateConnectorFn } from 'wagmi'
import { mock } from 'wagmi/connectors'

export interface CreateMockConnectorOverrides {
  name?: string
}

export function createMockConnector(
  walletClient: WalletClient<Transport, Chain, Account>,
  overrides: CreateMockConnectorOverrides = {},
): CreateConnectorFn {
  return createConnector((config) => ({
    ...mock({
      accounts: [walletClient.account.address],
    })(config),
    getClient: async () => walletClient,
    ...overrides,
  }))
}
