import { defineConfig } from '@wagmi/cli'
import { etherscan } from '@wagmi/cli/plugins'
import { gnosis, mainnet } from 'wagmi/chains'
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
            [gnosis.id]: '0xA98DaCB3fC964A6A0d2ce3B77294241585EAbA6d',
          },
        },
        {
          name: 'LendingPool',
          address: {
            [mainnet.id]: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
            [gnosis.id]: '0x2Dae5307c5E3FD1CF5A72Cb6F698f915860607e0',
          },
        },
        {
          name: 'WETHGateway',
          address: {
            [mainnet.id]: '0xBD7D6a9ad7865463DE44B05F04559f65e3B11704',
            [gnosis.id]: '0xBD7D6a9ad7865463DE44B05F04559f65e3B11704',
          },
        },
        {
          name: 'WalletBalanceProvider',
          address: {
            [mainnet.id]: '0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc',
            [gnosis.id]: '0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc',
          },
        },
        {
          name: 'UiPoolDataProvider',
          address: {
            [mainnet.id]: '0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb',
            [gnosis.id]: '0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb',
          },
        },
        {
          name: 'UiIncentiveDataProvider',
          address: {
            [mainnet.id]: '0xA7F8A757C4f7696c015B595F51B2901AC0121B18',
            [gnosis.id]: '0xA7F8A757C4f7696c015B595F51B2901AC0121B18',
          },
        },
        {
          name: 'Collector',
          address: {
            [mainnet.id]: '0xb137E7d16564c81ae2b0C8ee6B55De81dd46ECe5',
            [gnosis.id]: '0xb9E6DBFa4De19CCed908BcbFe1d015190678AB5f',
          },
        },
        {
          name: 'Chainlog',
          address: {
            [mainnet.id]: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
          },
        },
        {
          name: 'SavingsDai',
          address: {
            [mainnet.id]: '0x83f20f44975d03b1b09e64809b757c47f942beea',
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
          },
        },
        {
          name: 'IAMAutoLine',
          address: {
            [mainnet.id]: '0xC7Bdd1F2B16447dcf3dE045C4a039A60EC2f0ba3',
          },
        },
        {
          name: 'Pot',
          address: {
            [mainnet.id]: '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7',
          },
        },
      ],
    }),
    etherscan({
      apiKey: z.string().parse(process.env.GNOSISCAN_API_KEY),
      chainId: gnosis.id,
      contracts: [
        {
          name: 'SavingsXDaiAdapter',
          address: {
            [gnosis.id]: '0xD499b51fcFc66bd31248ef4b28d656d67E591A94',
          },
        },
        {
          name: 'SavingsXDai',
          address: {
            [gnosis.id]: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
          },
        },
      ],
    }),
  ],
})
