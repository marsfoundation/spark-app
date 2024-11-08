import { defineConfig } from '@wagmi/cli'
import { etherscan } from '@wagmi/cli/plugins'
import { base, gnosis, mainnet } from 'wagmi/chains'
import { z } from 'zod'
import { lendingPoolAddressProviderABI } from './abis/evm/lendingPoolAddressProvider'
import { lendingPoolABI } from './abis/evm/lendingPool'
import { wethGatewayABI } from './abis/evm/wethGateway'
import { walletBalanceProviderABI } from './abis/evm/walletBalanceProvider'
import { uiPoolDataProviderABI } from './abis/evm/uiPoolDataProvider'
import { uiIncentiveDataProviderABI } from './abis/evm/uiIncentiveDataProvider'
import { collectorABI } from './abis/evm/collector'
import { capAutomatorABI } from './abis/evm/capAutomator'

import 'dotenv/config'

const LAST_SEPOLIA_ID = 11457

const config: ReturnType<typeof defineConfig> = defineConfig({
  out: 'src/config/contracts-generated.ts',
  contracts: [
    {
      name: 'LendingPoolAddressProvider',
      abi: lendingPoolAddressProviderABI,
      address: {
        [mainnet.id]: '0x02C3eA4e34C0cBd694D2adFa2c690EECbC1793eE',
        [gnosis.id]: '0xA98DaCB3fC964A6A0d2ce3B77294241585EAbA6d',
        [LAST_SEPOLIA_ID]: '0x270542372e5a73c39E4290291AB88e2901cCEF2D',
      },
    },
    {
      name: 'LendingPool',
      abi: lendingPoolABI,
      address: {
        [mainnet.id]: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
        [gnosis.id]: '0x2Dae5307c5E3FD1CF5A72Cb6F698f915860607e0',
        [LAST_SEPOLIA_ID]: '0xBD2f32C02140641f497B0Db7B365122214f7c548',
      },
    },
    {
      name: 'WETHGateway',
      abi: wethGatewayABI,
      address: {
        [mainnet.id]: '0xBD7D6a9ad7865463DE44B05F04559f65e3B11704',
        [gnosis.id]: '0xBD7D6a9ad7865463DE44B05F04559f65e3B11704',
        [LAST_SEPOLIA_ID]: '0xDc61577918C467e8d39869482bbD074e7a53853F',
      },
    },
    {
      name: 'WalletBalanceProvider',
      abi: walletBalanceProviderABI,
      address: {
        [mainnet.id]: '0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc',
        [gnosis.id]: '0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc',
        [LAST_SEPOLIA_ID]: '0x6fB399569c7959F5c528f46ac61De7bE903451F4',
      },
    },
    {
      name: 'UiPoolDataProvider',
      abi: uiPoolDataProviderABI,
      address: {
        [mainnet.id]: '0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb',
        [gnosis.id]: '0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb',
        [LAST_SEPOLIA_ID]: '0x3B8e43c8C826897b9EF64254e52d0236b830901A',
      },
    },
    {
      name: 'UiIncentiveDataProvider',
      abi: uiIncentiveDataProviderABI,
      address: {
        [mainnet.id]: '0xA7F8A757C4f7696c015B595F51B2901AC0121B18',
        [gnosis.id]: '0xA7F8A757C4f7696c015B595F51B2901AC0121B18',
        [LAST_SEPOLIA_ID]: '0xfaefbF2ab3cC90dEAE255B061D32e27EccE4af4d',
      },
    },
    {
      name: 'Collector',
      abi: collectorABI,
      address: {
        [mainnet.id]: '0xb137E7d16564c81ae2b0C8ee6B55De81dd46ECe5',
        [gnosis.id]: '0xb9E6DBFa4De19CCed908BcbFe1d015190678AB5f',
        [LAST_SEPOLIA_ID]: '0x38cbCe65475b55571F65DbEf551397B790631943',
      },
    },
    {
      name: 'CapAutomator',
      abi: capAutomatorABI,
      address: {
        [mainnet.id]: '0x2276f52afba7Cf2525fd0a050DF464AC8532d0ef',
        [LAST_SEPOLIA_ID]: '0x1E056d8993f8E09815aa70C81D9e505bC9900ECD',
      },
    },
  ],
  plugins: [
    etherscan({
      apiKey: z.string().parse(process.env.ETHERSCAN_API_KEY, {
        errorMap: () => ({
          message: "Couldn't process ETHERSCAN_API_KEY env variable",
        }),
      }),
      chainId: mainnet.id,
      contracts: [
        // Aave v3
        // {
        //   name: 'LendingPoolAddressProvider',
        //   address: {
        //     [mainnet.id]: '0x02C3eA4e34C0cBd694D2adFa2c690EECbC1793eE',
        //     [gnosis.id]: '0xA98DaCB3fC964A6A0d2ce3B77294241585EAbA6d',
        //     [LAST_SEPOLIA_ID]: '0x270542372e5a73c39E4290291AB88e2901cCEF2D',
        //   },
        // },
        // {
        //   name: 'LendingPool',
        //   address: {
        //     [mainnet.id]: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
        //     [gnosis.id]: '0x2Dae5307c5E3FD1CF5A72Cb6F698f915860607e0',
        //     [LAST_SEPOLIA_ID]: '0x0CfE4DD7063034eE11f2D329D442B7c047469343',
        //   },
        // },
        // {
        //   name: 'WETHGateway',
        //   address: {
        //     [mainnet.id]: '0xBD7D6a9ad7865463DE44B05F04559f65e3B11704',
        //     [gnosis.id]: '0xBD7D6a9ad7865463DE44B05F04559f65e3B11704',
        //     [LAST_SEPOLIA_ID]: '0xDc61577918C467e8d39869482bbD074e7a53853F',
        //   },
        // },
        // {
        //   name: 'WalletBalanceProvider',
        //   address: {
        //     [mainnet.id]: '0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc',
        //     [gnosis.id]: '0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc',
        //     [LAST_SEPOLIA_ID]: '0x6fB399569c7959F5c528f46ac61De7bE903451F4',
        //   },
        // },
        // {
        //   name: 'UiPoolDataProvider',
        //   address: {
        //     [mainnet.id]: '0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb',
        //     [gnosis.id]: '0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb',
        //     [LAST_SEPOLIA_ID]: '0x3B8e43c8C826897b9EF64254e52d0236b830901A',
        //   },
        // },
        // {
        //   name: 'UiIncentiveDataProvider',
        //   address: {
        //     [mainnet.id]: '0xA7F8A757C4f7696c015B595F51B2901AC0121B18',
        //     [gnosis.id]: '0xA7F8A757C4f7696c015B595F51B2901AC0121B18',
        //     [LAST_SEPOLIA_ID]: '0xfaefbF2ab3cC90dEAE255B061D32e27EccE4af4d',
        //   },
        // },
        // {
        //   name: 'Collector',
        //   address: {
        //     [mainnet.id]: '0xb137E7d16564c81ae2b0C8ee6B55De81dd46ECe5',
        //     [gnosis.id]: '0xb9E6DBFa4De19CCed908BcbFe1d015190678AB5f',
        //     [LAST_SEPOLIA_ID]: '0x38cbCe65475b55571F65DbEf551397B790631943',
        //     // need to update gho-core to aave v3.2.0
        //   },
        // },
        // //Spark
        // {
        //   name: 'CapAutomator',
        //   address: {
        //     [mainnet.id]: '0x2276f52afba7Cf2525fd0a050DF464AC8532d0ef',
        //     [LAST_SEPOLIA_ID]: '0x1E056d8993f8E09815aa70C81D9e505bC9900ECD',
        //   },
        // },
        // DAI/MKR
        {
          /**
           * Don't see this used currently
           * */
          name: 'Chainlog',
          address: {
            [mainnet.id]: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
            // contract registry managed by governance (related to MKR DAO)
          },
        },
        {
          /**
           * Used in savings deposit/withdraw and farms
           * Also used in `useNavbar` (can be removed)
           * */
          name: 'SavingsDai',
          address: {
            [mainnet.id]: '0x83f20f44975d03b1b09e64809b757c47f942beea',
            /// SavingsDai.sol -- A tokenized representation DAI in the DSR (pot)
          },
        },
        {
          /**
           * `domain/d3m-info/D3MInfoQuery.ts
           * Used in market details only for DAI
           * */
          name: 'Vat',
          address: {
            [mainnet.id]: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
            /// MKR - vat.sol -- Dai CDP database
          },
        },
        {
          /**
           * `domain/d3m-info/D3MInfoQuery.ts`
           * Used in market details only for DAI
           * */
          name: 'IAMAutoLine',
          address: {
            [mainnet.id]: '0xC7Bdd1F2B16447dcf3dE045C4a039A60EC2f0ba3',
            /// debt ceilings for multi-collateral DAI
          },
        },
        {
          /**
           * Used in debug function `features/debug/index.tsx`
           * `domain/savings-info/mainnetSavingsInfo.ts`
           * Used in savings
           * */
          name: 'Pot',
          address: {
            [mainnet.id]: '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7',
            /// pot.sol -- Dai Savings Rate
          },
        },
        {
          /**
           * Used in savings deposit/withdraw for usdc<->susds
           * */
          name: 'PSMActions',
          address: {
            [mainnet.id]: '0x5803199F1085d52D1Bb527f24Dc1A2744e80A979',
            // * @notice Actions for swapping in PSM and depositing in an ERC4626 token.
          },
        },
        {
          /**
           * `features/actions/flavours/psm-convert/logic/psmConvertAction.ts`
           * `features/actions/flavours/convert-stables/logic/createConvertStablesActions.ts`
           * Used in convert actions to convert usdc<->usds
           * */
          name: 'UsdsPsmWrapper',
          address: {
            [mainnet.id]: '0xA188EEC8F81263234dA3622A406892F3D630f98c',
            //https://etherscan.io/address/0xa188eec8f81263234da3622a406892f3d630f98c#code
          },
        },
        {
          /**
           * `features/actions/flavours/psm-convert/logic/psmConvertAction.ts`
           * `features/actions/flavours/convert-stables/logic/createConvertStablesActions.ts`
           * Used in convert actions to convert usdc<->dai
           * */
          name: 'DssLitePsm',
          address: {
            [mainnet.id]: '0xf6e72Db5454dd049d0788e411b06CfAF16853042',
            //https://etherscan.io/address/0xf6e72db5454dd049d0788e411b06cfaf16853042#code
          },
        },
        {
          /**
           * `features/actions/flavours/convert-stables/logic/createConvertStablesActions.ts`
           * Used for "upgrading" or "downgrading" dai<->usds and savings deposit/withdraw
           * */
          name: 'MigrationActions',
          address: {
            [mainnet.id]: '0xf86141a5657Cf52AEB3E30eBccA5Ad3a8f714B89',
            //https://etherscan.io/address/0xf86141a5657cf52aeb3e30ebcca5ad3a8f714b89#code
          },
        },
        {
          /**
           * Used in savings deposit/withdraw
           * */
          name: 'UsdsPsmActions',
          address: {
            [mainnet.id]: '0xd0A61F2963622e992e6534bde4D52fd0a89F39E0',
            //https://etherscan.io/address/0xd0a61f2963622e992e6534bde4d52fd0a89f39e0#code
          },
        },
      ],
    }),
    etherscan({
      apiKey: z.string().parse(process.env.GNOSISCAN_API_KEY, {
        errorMap: () => ({
          message: "Couldn't process GNOSISCAN_API_KEY env variable",
        }),
      }),
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
    etherscan({
      apiKey: z.string().parse(process.env.BASESCAN_API_KEY, {
        errorMap: () => ({
          message: "Couldn't process BASESCAN_API_KEY env variable",
        }),
      }),
      chainId: base.id,
      contracts: [
        {
          name: 'SSRAuthOracle',
          address: {
            [base.id]: '0x65d946e533748A998B1f0E430803e39A6388f7a1',
          },
        },
      ],
    }),
  ],
})

export default config
