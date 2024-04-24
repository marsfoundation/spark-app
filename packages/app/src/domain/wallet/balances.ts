import { queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'

import {
  lendingPoolAddressProviderAddress,
  walletBalanceProviderAbi,
  walletBalanceProviderConfig,
} from '@/config/contracts-generated'

import { getContractAddress } from '../hooks/useContractAddress'
import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber } from '../types/NumericValues'

export interface BalanceOptions {
  wagmiConfig: Config
  account?: Address
  chainId: number
}

export interface BalanceItem {
  address: CheckedAddress
  balanceBaseUnit: BaseUnitNumber
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function balances({ wagmiConfig, account, chainId }: BalanceOptions) {
  const lendingPoolAddressProvider = getContractAddress(lendingPoolAddressProviderAddress, chainId)

  return queryOptions<BalanceItem[]>({
    queryKey: [
      {
        functionName: 'getUserWalletBalances',
      },
      lendingPoolAddressProvider,
      account,
      chainId,
    ],
    queryFn: async () => {
      if (!account) {
        return []
      }

      const [addresses, balances] = await readContract(wagmiConfig, {
        address: getContractAddress(walletBalanceProviderConfig.address, chainId),
        abi: walletBalanceProviderAbi,
        functionName: 'getUserWalletBalances',
        args: [lendingPoolAddressProvider, account],
      })

      return addresses
        .map(
          (address, index): BalanceItem => ({
            address: CheckedAddress(address),
            balanceBaseUnit: BaseUnitNumber(balances[index]!),
          }),
        )
        .sort((a, b) => b.balanceBaseUnit.minus(a.balanceBaseUnit).toNumber())
    },
  })
}
