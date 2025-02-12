import { psm3Address } from '@/config/contracts-generated'
import { DynamicValidatorConfig, ensureDynamicValidatorConfigTypes } from '@/domain/common/dynamicValidator'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { SavingsConverter } from '@/domain/savings-converters/types'
import { TokenRepository } from '@/domain/token-repository/TokenRepository'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { BaseUnitNumber, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { QueryKey, useSuspenseQuery } from '@tanstack/react-query'
import { erc20Abi } from 'viem'
import { arbitrum, base } from 'viem/chains'
import { Config, useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { z } from 'zod'
import {
  getSavingsWithdrawDialogFormValidator,
  validateWithdrawFromSavingsWithPsm3,
  withdrawValidationIssueToMessage,
} from './validation'

export type WithdrawFromSavingsValidator = z.ZodSchema<{
  symbol: string
  value: string
  isMaxSelected?: boolean | undefined
}>

export interface UseWithdrawFromSavingsValidatorParams {
  chainId: number
  tokenRepository: TokenRepository
  savingsToken: Token
  savingsTokenBalance: NormalizedUnitNumber
  savingsConverter: SavingsConverter
}

export function useWithdrawFromSavingsValidator({
  chainId,
  tokenRepository,
  savingsToken,
  savingsTokenBalance,
  savingsConverter,
}: UseWithdrawFromSavingsValidatorParams): WithdrawFromSavingsValidator {
  const wagmiConfig = useConfig()

  const { fetchParamsQueryKey, fetchParamsQueryFn, createValidator } = getValidatorConfig({
    chainId,
    tokenRepository,
    wagmiConfig,
    savingsToken,
    savingsTokenBalance,
    savingsConverter,
  })

  const { data } = useSuspenseQuery({
    queryKey: fetchParamsQueryKey,
    queryFn: fetchParamsQueryFn,
  })

  return createValidator(data)
}

export interface GetValidatorConfigParams {
  chainId: number
  tokenRepository: TokenRepository
  wagmiConfig: Config
  savingsToken: Token
  savingsTokenBalance: NormalizedUnitNumber
  savingsConverter: SavingsConverter
}
export function getValidatorConfig({
  chainId,
  tokenRepository,
  wagmiConfig,
  savingsToken,
  savingsTokenBalance,
  savingsConverter,
}: GetValidatorConfigParams): DynamicValidatorConfig {
  if (chainId === base.id || chainId === arbitrum.id) {
    const usds = tokenRepository.findOneTokenBySymbol(TokenSymbol('USDS'))
    const usdc = tokenRepository.findOneTokenBySymbol(TokenSymbol('USDC'))
    const psm3 = getContractAddress(psm3Address, chainId)

    return ensureDynamicValidatorConfigTypes({
      fetchParamsQueryKey: getCreateValidatorConfigQueryKey(savingsToken, chainId),
      fetchParamsQueryFn: async () => {
        const [psm3UsdsBalance, psm3UsdcBalance] = await Promise.all([
          readContract(wagmiConfig, {
            address: usds.address,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [psm3],
          }),
          readContract(wagmiConfig, {
            address: usdc.address,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [psm3],
          }),
        ])

        return {
          psm3UsdsBalance: usds.fromBaseUnit(BaseUnitNumber(psm3UsdsBalance)),
          psm3UsdcBalance: usdc.fromBaseUnit(BaseUnitNumber(psm3UsdcBalance)),
        }
      },
      createValidator: ({ psm3UsdcBalance, psm3UsdsBalance }) =>
        getSavingsWithdrawDialogFormValidator({ savingsConverter, savingsTokenBalance }).superRefine((field, ctx) => {
          const value = NormalizedUnitNumber(field.value === '' ? '0' : field.value)
          const isUsdcWithdraw = field.symbol === usdc.symbol
          const isMaxSelected = field.isMaxSelected
          const usdBalance = savingsConverter.convertToAssets({ shares: savingsTokenBalance })

          const issue = validateWithdrawFromSavingsWithPsm3({
            value,
            isUsdcWithdraw,
            isMaxSelected,
            user: { balance: usdBalance },
            psm3: {
              usdsBalance: psm3UsdsBalance,
              usdcBalance: psm3UsdcBalance,
            },
          })
          if (issue) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: withdrawValidationIssueToMessage[issue],
              path: ['value'],
            })
          }
        }),
    })
  }

  return ensureDynamicValidatorConfigTypes({
    fetchParamsQueryKey: getCreateValidatorConfigQueryKey(savingsToken, chainId),
    fetchParamsQueryFn: () => Promise.resolve({}),
    createValidator: () => getSavingsWithdrawDialogFormValidator({ savingsConverter, savingsTokenBalance }),
  })
}

function getCreateValidatorConfigQueryKey(savingsToken: Token, chainId: number): QueryKey {
  return [chainId, 'dynamic-validator-withdraw-from-savings', savingsToken.symbol]
}
