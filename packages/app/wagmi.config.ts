import { defineConfig } from '@wagmi/cli'
import { etherscan } from '@wagmi/cli/plugins'
import { goerli, mainnet } from 'wagmi/chains'
import { z } from 'zod'

export default defineConfig({
  out: 'src/config/contracts-generated.ts',
  contracts: [],
  plugins: [
    etherscan({
      apiKey: z.string().parse(process.env.ETHERSCAN_API_KEY),
      chainId: mainnet.id,
      contracts: [
        {
          name: 'LendingPoolAddressProvider',
          address: {
            [mainnet.id]: '0x02C3eA4e34C0cBd694D2adFa2c690EECbC1793eE',
            [goerli.id]: '0x026a5B6114431d8F3eF2fA0E1B2EDdDccA9c540E',
          },
        },
        {
          name: 'LendingPool',
          address: {
            [mainnet.id]: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
            [goerli.id]: '0x26ca51Af4506DE7a6f0785D20CD776081a05fF6d',
          },
        },
        {
          name: 'WETHGateway',
          address: {
            [mainnet.id]: '0xBD7D6a9ad7865463DE44B05F04559f65e3B11704',
            [goerli.id]: '0xe6fC577E87F7c977c4393300417dCC592D90acF8',
          },
        },
        {
          name: 'WalletBalanceProvider',
          address: {
            [mainnet.id]: '0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc',
            [goerli.id]: '0x261135877A92B42183c998bFB8580558a28377a6',
          },
        },
        {
          name: 'UiPoolDataProvider',
          address: {
            [mainnet.id]: '0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb',
            [goerli.id]: '0x36eddc380C7f370e5f05Da5Bd7F970a27f063e39',
          },
        },
        {
          name: 'UiIncentiveDataProvider',
          address: {
            [mainnet.id]: '0xA7F8A757C4f7696c015B595F51B2901AC0121B18',
            [goerli.id]: '0x1472B7d120ab62D60f60e1D804B3858361c3C475',
          },
        },
        {
          name: 'Collector',
          address: {
            [mainnet.id]: '0xb137E7d16564c81ae2b0C8ee6B55De81dd46ECe5',
            [goerli.id]: '0x0D56700c90a690D8795D6C148aCD94b12932f4E3',
          },
        },
        {
          name: 'Chainlog',
          address: {
            [mainnet.id]: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
            [goerli.id]: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
          },
        },
        {
          name: 'SavingsDai',
          address: {
            [mainnet.id]: '0x83f20f44975d03b1b09e64809b757c47f942beea',
            [goerli.id]: '0xd8134205b0328f5676aaefb3b2a0dc15f4029d8c',
          },
        },
        {
          name: 'V3Migrator',
          address: {
            [mainnet.id]: '0xe2a3C1ff038E14d401cA6dE0673a598C33168460',
          },
        },
        {
          name: 'Vat',
          address: {
            [mainnet.id]: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
            [goerli.id]: '0xB966002DDAa2Baf48369f5015329750019736031',
          },
        },
        {
          name: 'IAMAutoLine',
          address: {
            [mainnet.id]: '0xC7Bdd1F2B16447dcf3dE045C4a039A60EC2f0ba3',
            [goerli.id]: '0x21DaD87779D9FfA8Ed3E1036cBEA8784cec4fB83',
          },
        },
        {
          name: 'Pot',
          address: {
            [mainnet.id]: '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7',
            [goerli.id]: '0x50672F0a14B40051B65958818a7AcA3D54Bd81Af',
          },
        },
      ],
    }),
    etherscan({
      apiKey: z.string().parse(process.env.ETHERSCAN_API_KEY),
      chainId: goerli.id,
      contracts: [
        {
          name: 'Faucet',
          address: {
            [goerli.id]: '0xe2bE5BfdDbA49A86e27f3Dd95710B528D43272C2',
          },
        },
      ],
    }),
  ],
})
