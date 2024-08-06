import { useQueryClient } from '@tanstack/react-query'
import { Abi, Address } from 'viem'
import { UseSimulateContractParameters, useAccount, useChainId, useConfig } from 'wagmi'

import { poolAbi } from '@/config/abis/poolAbi'
import { NATIVE_ASSET_MOCK_ADDRESS } from '@/config/consts'
import { lendingPoolAddress, wethGatewayConfig } from '@/config/contracts-generated'
import { ensureConfigTypes, useWrite } from '@/domain/hooks/useWrite'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { Permit } from '@/features/actions/logic/permits'
import { toBigInt } from '@/utils/bigNumber'
import { getTimestampInSeconds } from '@/utils/time'

import { useContractAddress } from '../hooks/useContractAddress'
import { aaveDataLayerQueryKey } from '../market-info/aave-data-layer/query'
import { getBalancesQueryKeyPrefix } from '../wallet/getBalancesQueryKeyPrefix'
import { allowance } from './allowance/query'

export type UseSupplyArgs = {
  asset: Address
  value: BaseUnitNumber
  permit?: Permit
  onTransactionSettled?: () => void
  enabled?: boolean
}

export function useSupply({
  asset,
  value: _value,
  permit,
  onTransactionSettled,
  enabled = true,
}: UseSupplyArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()

  const { address: userAddress } = useAccount()
  const lendingPool = useContractAddress(lendingPoolAddress)
  const wethGateway = useContractAddress(wethGatewayConfig.address)
  const wagmiConfig = useConfig()

  const chainId = useChainId()
  const referralCode = 0
  const value = toBigInt(_value)

  const config = getSupplyWriteConfig({
    asset,
    value,
    userAddress,
    lendingPool,
    wethGateway,
    referralCode,
    permit,
  })

  return useWrite(
    {
      ...config,
      enabled: !!userAddress && value > 0n && enabled,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: aaveDataLayerQueryKey({ chainId, account: userAddress }),
        })
        void client.invalidateQueries({
          queryKey: getBalancesQueryKeyPrefix({ chainId, account: userAddress }),
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

interface GetSupplyWriteConfigArgs {
  asset: Address
  value: bigint
  userAddress?: Address
  lendingPool: Address
  wethGateway: Address
  referralCode: number
  permit?: Permit
}
function getSupplyWriteConfig({
  asset,
  value,
  userAddress,
  lendingPool,
  wethGateway,
  referralCode,
  permit,
}: GetSupplyWriteConfigArgs): UseSimulateContractParameters<Abi, string> {
  if (asset === NATIVE_ASSET_MOCK_ADDRESS) {
    return ensureConfigTypes({
      abi: wethGatewayConfig.abi,
      address: wethGateway,
      functionName: 'depositETH',
      value,
      args: [lendingPool, userAddress!, referralCode],
    })
  }

  if (permit) {
    return ensureConfigTypes({
      address: lendingPool,
      abi: poolAbi,
      functionName: 'supplyWithPermit',
      args: [
        asset,
        value,
        userAddress!,
        referralCode,
        toBigInt(getTimestampInSeconds(permit.deadline)),
        Number(permit.signature.v),
        permit.signature.r,
        permit.signature.s,
      ],
    })
  }

  return ensureConfigTypes({
    address: lendingPool,
    abi: poolAbi,
    functionName: 'supply',
    args: [asset, value, userAddress!, referralCode],
  })
}
