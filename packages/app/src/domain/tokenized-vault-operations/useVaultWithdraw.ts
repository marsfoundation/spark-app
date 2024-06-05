import { savingsDaiConfig } from '@/config/contracts-generated'
import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { Abi, Address } from 'viem'
import { UseSimulateContractParameters, useAccount, useChainId, useConfig } from 'wagmi'
import { useContractAddress } from '../hooks/useContractAddress'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { aaveDataLayer } from '../market-info/aave-data-layer/query'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { balances } from '../wallet/balances'

interface UseVaultWithdrawArgs {
  value: BaseUnitNumber
  max?: boolean
  onTransactionSettled?: () => void
  enabled?: boolean
}

export function useVaultWithdraw({
  value,
  max,
  onTransactionSettled,
  enabled = true,
}: UseVaultWithdrawArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const { address: userAddress } = useAccount()
  const vault = useContractAddress(savingsDaiConfig.address)

  const config = getConfig({ receiver: userAddress!, vault, value, max })

  return useWrite(
    {
      ...config,
      enabled: !!userAddress && enabled && value.gt(0),
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: aaveDataLayer({ wagmiConfig, chainId, account: userAddress }).queryKey,
        })
        void client.invalidateQueries({
          queryKey: balances({ wagmiConfig, chainId, account: userAddress }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}

interface GetConfigParams {
  value: BaseUnitNumber
  receiver: Address
  vault: CheckedAddress
  max?: boolean
}

function getConfig({ value, receiver, vault, max }: GetConfigParams): UseSimulateContractParameters<Abi, string> {
  if (max) {
    return ensureConfigTypes({
      address: vault,
      abi: savingsDaiConfig.abi,
      functionName: 'redeem',
      args: [toBigInt(value), receiver, receiver],
    })
  }

  return ensureConfigTypes({
    address: vault,
    abi: savingsDaiConfig.abi,
    functionName: 'withdraw',
    args: [toBigInt(value), receiver, receiver],
  })
}
