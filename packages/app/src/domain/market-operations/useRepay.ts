import { useQueryClient } from '@tanstack/react-query'
import { Abi, Address } from 'viem'
import { useAccount, useChainId, useConfig, UseSimulateContractParameters } from 'wagmi'

import { poolAbi } from '@/config/abis/poolAbi'
import { InterestRate, NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { lendingPoolAddress, wethGatewayConfig } from '@/config/contracts-generated'
import { ensureConfigTypes, useWrite } from '@/domain/hooks/useWrite'
import { Permit } from '@/features/actions/logic/permits'
import { toBigInt } from '@/utils/bigNumber'
import { getTimestampInSeconds } from '@/utils/time'

import { useContractAddress } from '../hooks/useContractAddress'
import { aaveDataLayer } from '../market-info/aave-data-layer/query'
import { BaseUnitNumber } from '../types/NumericValues'
import { balances } from '../wallet/balances'
import { allowance } from './allowance/query'

interface UseRepayArgs {
  asset: Address
  value: BaseUnitNumber
  useAToken: boolean
  permit?: Permit
  enabled?: boolean
  onTransactionSettled?: () => void
}

export function useRepay({
  asset,
  value: _value,
  useAToken,
  permit,
  enabled = true,
  onTransactionSettled,
}: UseRepayArgs): ReturnType<typeof useWrite> {
  const { address: userAddress } = useAccount()
  const client = useQueryClient()
  const chainId = useChainId()
  const lendingPool = useContractAddress(lendingPoolAddress)
  const wethGateway = useContractAddress(wethGatewayConfig.address)
  const wagmiConfig = useConfig()
  const value = toBigInt(_value)

  return useWrite(
    {
      ...getConfig({ lendingPool, wethGateway, asset, value, useAToken, userAddress, permit }),
      enabled: enabled && value > 0n && !!userAddress && !!lendingPool,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: aaveDataLayer({ wagmiConfig, chainId, account: userAddress }).queryKey,
        })
        void client.invalidateQueries({
          queryKey: balances({ wagmiConfig, chainId, account: userAddress }).queryKey,
        })
        void client.invalidateQueries({
          queryKey: allowance({ wagmiConfig, chainId, token: asset, account: userAddress!, spender: lendingPool })
            .queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}

interface GetConfigOptions {
  lendingPool: Address
  wethGateway: Address
  asset: Address
  useAToken: boolean
  value: bigint
  permit: Permit | undefined
  userAddress: Address | undefined
}

function getConfig({
  lendingPool,
  wethGateway,
  asset,
  useAToken,
  value,
  permit,
  userAddress,
}: GetConfigOptions): UseSimulateContractParameters<Abi, string> {
  const interestRateMode = BigInt(InterestRate.Variable)

  if (useAToken) {
    return ensureConfigTypes({
      address: lendingPool,
      abi: poolAbi,
      functionName: 'repayWithATokens',
      args: [asset, value, interestRateMode],
    })
  }

  if (permit) {
    return ensureConfigTypes({
      address: lendingPool,
      abi: poolAbi,
      functionName: 'repayWithPermit',
      args: [
        asset,
        value,
        interestRateMode,
        userAddress!,
        toBigInt(getTimestampInSeconds(permit.deadline)),
        Number(permit.signature.v),
        permit.signature.r,
        permit.signature.s,
      ],
    })
  }

  if (asset === NATIVE_ASSET_MOCK_ADDRESS) {
    return ensureConfigTypes({
      address: wethGateway,
      abi: wethGatewayConfig.abi,
      functionName: 'repayETH',
      args: [lendingPool, value, interestRateMode, userAddress!],
      value,
    })
  }

  return ensureConfigTypes({
    address: lendingPool,
    abi: poolAbi,
    functionName: 'repay',
    args: [asset, value, interestRateMode, userAddress!],
  })
}
