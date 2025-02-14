import { susdsAddresses } from '@/config/chain/constants'
import {
  psmActionsConfig,
  savingsDaiConfig,
  usdcVaultAddress,
  usdsPsmActionsConfig,
} from '@/config/contracts-generated'
import { JSONStringifyRich } from '@/utils/object'
import { skipToken, useQuery } from '@tanstack/react-query'
import { Abi, Address, ContractFunctionName, erc4626Abi, isAddressEqual } from 'viem'
import { estimateContractGas } from 'viem/actions'
import { mainnet } from 'viem/chains'
import { UseSimulateContractParameters, useAccount, useChainId, usePublicClient } from 'wagmi'
import { useOriginChainId } from './useOriginChainId'

const GAS_LIMIT_BUFFER = 100_000n
const TRANSACTIONS_WITH_INCREASED_GAS_LIMIT = [
  createConfigEntry({
    chainId: mainnet.id,
    address: savingsDaiConfig.address[mainnet.id],
    abi: savingsDaiConfig.abi,
    functionName: 'withdraw',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: savingsDaiConfig.address[mainnet.id],
    abi: savingsDaiConfig.abi,
    functionName: 'redeem',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: savingsDaiConfig.address[mainnet.id],
    abi: savingsDaiConfig.abi,
    functionName: 'deposit',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: psmActionsConfig.address[mainnet.id],
    abi: psmActionsConfig.abi,
    functionName: 'withdrawAndSwap',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: psmActionsConfig.address[mainnet.id],
    abi: psmActionsConfig.abi,
    functionName: 'redeemAndSwap',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: psmActionsConfig.address[mainnet.id],
    abi: psmActionsConfig.abi,
    functionName: 'swapAndDeposit',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: susdsAddresses[mainnet.id],
    abi: erc4626Abi,
    functionName: 'withdraw',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: susdsAddresses[mainnet.id],
    abi: erc4626Abi,
    functionName: 'redeem',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: susdsAddresses[mainnet.id],
    abi: erc4626Abi,
    functionName: 'deposit',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: usdsPsmActionsConfig.address[mainnet.id],
    abi: usdsPsmActionsConfig.abi,
    functionName: 'withdrawAndSwap',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: usdsPsmActionsConfig.address[mainnet.id],
    abi: usdsPsmActionsConfig.abi,
    functionName: 'redeemAndSwap',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: usdsPsmActionsConfig.address[mainnet.id],
    abi: usdsPsmActionsConfig.abi,
    functionName: 'swapAndDeposit',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: usdcVaultAddress[mainnet.id],
    abi: erc4626Abi,
    functionName: 'withdraw',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: usdcVaultAddress[mainnet.id],
    abi: erc4626Abi,
    functionName: 'redeem',
  }),
  createConfigEntry({
    chainId: mainnet.id,
    address: usdcVaultAddress[mainnet.id],
    abi: erc4626Abi,
    functionName: 'deposit',
  }),
]

export interface UseIncreasedGasLimitResult {
  data: bigint | undefined
  isLoading: boolean
  isReady: boolean
}

export function useIncreasedGasLimit(params: UseSimulateContractParameters<Abi, string>): UseIncreasedGasLimitResult {
  const chainId = useChainId()
  const { address: account } = useAccount()
  const originChainId = useOriginChainId()
  const client = usePublicClient()

  const { address, abi, functionName, args } = params

  const shouldIncreaseGasLimit =
    !!address &&
    TRANSACTIONS_WITH_INCREASED_GAS_LIMIT.some(
      (config) =>
        config.chainId === originChainId &&
        config.address &&
        isAddressEqual(config.address, address) &&
        config.functionName === functionName,
    )

  const { data, isLoading, isError } = useQuery({
    queryKey: ['estimate-gas', chainId, address, account, functionName, JSONStringifyRich(args)],
    queryFn:
      client && address && abi && functionName && shouldIncreaseGasLimit
        ? async () => {
            const gas = await estimateContractGas(client, {
              account,
              address,
              abi,
              functionName,
              args,
            })

            return gas
          }
        : skipToken,
    retry: 0, //do not retry as it's just an approximation that helps transactions fail less frequently
    gcTime: 0,
  })

  return {
    data: data && data + GAS_LIMIT_BUFFER,
    isLoading,
    isReady: !shouldIncreaseGasLimit || !!data || isError, // if error, ignore trying to increase gas limit
  }
}

interface CreateConfigEntryParams<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
> {
  chainId: number
  address: Address
  abi: TAbi
  functionName: TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'> ? TFunctionName : never
}
interface CreateConfigEntryResult {
  address: Address
  chainId: number
  functionName: string
}

// needed for type safety
function createConfigEntry<
  TAbi extends Abi,
  TFunctionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
>({ chainId, functionName, address }: CreateConfigEntryParams<TAbi, TFunctionName>): CreateConfigEntryResult {
  return {
    address,
    chainId,
    functionName,
  }
}
