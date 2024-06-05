import { toBigInt } from '@/utils/bigNumber'
import { useQueryClient } from '@tanstack/react-query'
import { erc4626Abi } from 'viem'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { ensureConfigTypes, useWrite } from '../hooks/useWrite'
import { allowance } from '../market-operations/allowance/query'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'
import { balances } from '../wallet/balances'

export interface UseVaultDepositArgs {
  vault: CheckedAddress
  assetToken: CheckedAddress
  assetsAmount: BaseUnitNumber
  onTransactionSettled?: () => void
  enabled?: boolean
}

export function useVaultDeposit({
  vault,
  assetToken,
  assetsAmount,
  onTransactionSettled,
  enabled = true,
}: UseVaultDepositArgs): ReturnType<typeof useWrite> {
  const client = useQueryClient()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  const { address: receiver } = useAccount()

  const config = ensureConfigTypes({
    address: vault,
    abi: erc4626Abi,
    functionName: 'deposit',
    args: [toBigInt(assetsAmount), receiver!],
  })

  return useWrite(
    {
      ...config,
      enabled: enabled && assetsAmount.gt(0) && !!receiver,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: balances({ wagmiConfig, chainId, account: receiver }).queryKey,
        })
        void client.invalidateQueries({
          queryKey: allowance({ wagmiConfig, chainId, token: assetToken, account: receiver!, spender: vault }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
