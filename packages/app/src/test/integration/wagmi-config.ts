import { Address, type Chain, type Transport, createWalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { createConfig } from 'wagmi'

import { createMockConnector } from '../../domain/wallet/createMockConnector'

export type WalletOptions = { address: Address } | { privateKey: `0x${string}` }
export interface CreateWagmiTestConfigOptions {
  transport: Transport
  chain?: Chain
  wallet?: WalletOptions
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createWagmiTestConfig(options: CreateWagmiTestConfigOptions) {
  const { transport, wallet } = options
  const chain = options.chain ?? mainnet

  const connectors = wallet ? getWagmiConnectors({ chain, transport, ...wallet }) : []

  return createConfig({
    chains: [chain],
    transports: {
      [chain.id]: transport,
    },
    connectors,
    batch: {
      multicall: false,
    },
    pollingInterval: 100,
  })
}

export interface GetWagmiConnectorsOptionsBase {
  chain: Chain
  transport: Transport
}

export interface GetWagmiConnectorsOptionsWithAddress extends GetWagmiConnectorsOptionsBase {
  address: Address
}

export interface GetWagmiConnectorsOptionsWithPrivateKey extends GetWagmiConnectorsOptionsBase {
  privateKey: `0x${string}`
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getWagmiConnectors(
  options: GetWagmiConnectorsOptionsWithAddress | GetWagmiConnectorsOptionsWithPrivateKey,
) {
  const account = 'address' in options ? options.address : privateKeyToAccount(options.privateKey)
  const { chain, transport } = options

  const walletClient = createWalletClient({
    transport,
    chain,
    pollingInterval: 100,
    account,
  })

  const mockConnector = createMockConnector(walletClient)

  return [mockConnector]
}
