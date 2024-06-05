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

export type UseVaultWithdrawArgs =
  | {
      assets: BaseUnitNumber
      onTransactionSettled?: () => void
      enabled?: boolean
    }
  | { max: true; shares: BaseUnitNumber; onTransactionSettled?: () => void; enabled?: boolean }

export function useVaultWithdraw({
  onTransactionSettled,
  enabled = true,
  ...rest
}: UseVaultWithdrawArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const { address: userAddress } = useAccount()
  const vault = useContractAddress(savingsDaiConfig.address)

  const config = getConfig({ receiver: userAddress!, vault, ...rest })
  const hasWithdrawAmount = ('assets' in rest && rest.assets.gt(0)) || ('shares' in rest && rest.shares.gt(0))

  return useWrite(
    {
      ...config,
      enabled: !!userAddress && enabled && hasWithdrawAmount,
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

type GetConfigParams =
  | { assets: BaseUnitNumber; receiver: Address; vault: CheckedAddress }
  | { max: boolean; shares: BaseUnitNumber; receiver: Address; vault: CheckedAddress }

function getConfig(params: GetConfigParams): UseSimulateContractParameters<Abi, string> {
  const { vault, receiver } = params
  if ('max' in params) {
    const { shares } = params
    return ensureConfigTypes({
      address: vault,
      abi: savingsDaiConfig.abi,
      functionName: 'redeem',
      args: [toBigInt(shares), receiver, receiver],
    })
  }

  const { assets } = params
  return ensureConfigTypes({
    address: vault,
    abi: savingsDaiConfig.abi,
    functionName: 'withdraw',
    args: [toBigInt(assets), receiver, receiver],
  })
}
