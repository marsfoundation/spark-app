import { psm3Address } from '@/config/contracts-generated'
import { DynamicValidatorConfig, ensureDynamicValidatorConfigTypes } from '@/domain/common/dynamicValidator'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { SavingsAccount } from '@/domain/savings-converters/types'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { getTransferFromUserFormValidator } from '@/features/dialogs/common/logic/transfer-from-user/validation'
import { BaseUnitNumber, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { QueryKey, useSuspenseQuery } from '@tanstack/react-query'
import { erc20Abi } from 'viem'
import { arbitrum, base } from 'viem/chains'
import { Config, useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { z } from 'zod'
import { depositValidationIssueToMessage, validateDepositToSavingsWithPsm3 } from './validation'

export type AssetInputValidator = z.ZodSchema<{
  symbol: string
  value: string
  isMaxSelected?: boolean | undefined
}>

export interface UseDepositToSavingsValidatorParams {
  chainId: number
  tokensInfo: TokensInfo
  savingsAccount: SavingsAccount
}

export function useDepositToSavingsValidator({
  chainId,
  tokensInfo,
  savingsAccount,
}: UseDepositToSavingsValidatorParams): AssetInputValidator {
  const wagmiConfig = useConfig()

  const { fetchParamsQueryKey, fetchParamsQueryFn, createValidator } = getValidatorConfig({
    chainId,
    tokensInfo,
    wagmiConfig,
    savingsAccount,
  })

  const { data } = useSuspenseQuery({
    queryKey: fetchParamsQueryKey,
    queryFn: fetchParamsQueryFn,
  })

  return createValidator(data)
}

export interface GetValidatorConfigParams {
  chainId: number
  tokensInfo: TokensInfo
  wagmiConfig: Config
  savingsAccount: SavingsAccount
}
export function getValidatorConfig({
  chainId,
  tokensInfo,
  wagmiConfig,
  savingsAccount,
}: GetValidatorConfigParams): DynamicValidatorConfig {
  if (chainId === base.id || chainId === arbitrum.id) {
    const susds = tokensInfo.findOneTokenBySymbol(TokenSymbol('sUSDS'))
    const psm3 = getContractAddress(psm3Address, chainId)

    return ensureDynamicValidatorConfigTypes({
      fetchParamsQueryKey: getCreateValidatorConfigQueryKey(savingsAccount.savingsToken, chainId),
      fetchParamsQueryFn: async () => {
        const psm3SusdsBalance = await readContract(wagmiConfig, {
          address: susds.address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [psm3],
        })

        return susds.fromBaseUnit(BaseUnitNumber(psm3SusdsBalance))
      },
      createValidator: (psm3SusdsBalance) =>
        getTransferFromUserFormValidator(tokensInfo, depositValidationIssueToMessage).superRefine((field, ctx) => {
          const value = NormalizedUnitNumber(field.value === '' ? '0' : field.value)
          const estimatedSusdsReceived = savingsAccount.converter.convertToShares({ assets: value })
          const issue = validateDepositToSavingsWithPsm3({
            psm3SusdsBalance,
            estimatedSusdsReceived,
          })

          if (issue) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: depositValidationIssueToMessage[issue],
              path: ['value'],
            })
          }
        }),
    })
  }

  return ensureDynamicValidatorConfigTypes({
    fetchParamsQueryKey: getCreateValidatorConfigQueryKey(savingsAccount.savingsToken, chainId),
    fetchParamsQueryFn: () => Promise.resolve({}),
    createValidator: () => getTransferFromUserFormValidator(tokensInfo, depositValidationIssueToMessage),
  })
}

function getCreateValidatorConfigQueryKey(savingsToken: Token, chainId: number): QueryKey {
  return [chainId, 'dynamic-validator-deposit-to-savings', savingsToken.symbol]
}
