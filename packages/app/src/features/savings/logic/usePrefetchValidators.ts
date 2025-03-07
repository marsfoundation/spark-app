import { SavingsAccountRepository } from '@/domain/savings-converters/types'
import { TokenRepository } from '@/domain/token-repository/TokenRepository'
import { getValidatorConfig as getDepositValidatorConfig } from '@/features/dialogs/savings/deposit/logic/useDepositToSavingsValidator'
import { getValidatorConfig as getWithdrawValidatorConfig } from '@/features/dialogs/savings/withdraw/logic/useWithdrawFromSavingsValidator'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useConfig } from 'wagmi'

export interface UsePrefetchValidatorsParams {
  chainId: number
  tokenRepository: TokenRepository
  savingsAccounts: SavingsAccountRepository
}

export function usePrefetchValidators({
  chainId,
  tokenRepository,
  savingsAccounts,
}: UsePrefetchValidatorsParams): void {
  const queryClient = useQueryClient()
  const wagmiConfig = useConfig()

  // biome-ignore lint/correctness/useExhaustiveDependencies: tokenRepository and savingsAccounts are not referentially stable
  useEffect(() => {
    for (const savingsAccount of savingsAccounts.all()) {
      const depositValidatorConfig = getDepositValidatorConfig({
        chainId,
        tokenRepository,
        wagmiConfig,
        savingsAccount,
      })
      void queryClient.prefetchQuery({
        queryKey: depositValidatorConfig.fetchParamsQueryKey,
        queryFn: depositValidatorConfig.fetchParamsQueryFn,
      })

      const withdrawValidatorConfig = getWithdrawValidatorConfig({
        chainId,
        tokenRepository,
        wagmiConfig,
        savingsToken: savingsAccount.savingsToken,
        savingsTokenBalance: tokenRepository.findOneBalanceBySymbol(savingsAccount.savingsToken.symbol),
        savingsConverter: savingsAccount.converter,
      })

      void queryClient.prefetchQuery({
        queryKey: withdrawValidatorConfig.fetchParamsQueryKey,
        queryFn: withdrawValidatorConfig.fetchParamsQueryFn,
      })
    }
  }, [chainId, queryClient, wagmiConfig])
}
