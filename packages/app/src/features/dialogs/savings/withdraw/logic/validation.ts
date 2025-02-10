import { SavingsConverter } from '@/domain/savings-converters/types'
import { receiverValidationIssueToMessage, validateReceiver } from '@/domain/savings/validateReceiver'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { Address } from 'viem'
import { z } from 'zod'
import { ReceiverFormSchema } from '../types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getSavingsWithdrawDialogFormValidator({
  savingsTokenBalance,
  savingsConverter,
}: {
  savingsTokenBalance: NormalizedUnitNumber
  savingsConverter: SavingsConverter
}) {
  return AssetInputSchema.superRefine((field, ctx) => {
    const value = NormalizedUnitNumber(field.value === '' ? '0' : field.value)
    const isMaxSelected = field.isMaxSelected
    const usdBalance = savingsConverter.convertToAssets({ shares: savingsTokenBalance })

    const issue = validateWithdraw({
      value,
      isMaxSelected,
      user: { balance: usdBalance },
    })
    if (issue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: withdrawValidationIssueToMessage[issue],
        path: ['value'],
      })
    }
  })
}

export type WithdrawValidationIssue =
  | 'exceeds-balance'
  | 'value-not-positive'
  | 'usds-withdraw-cap-reached'
  | 'usdc-withdraw-cap-reached'

export interface ValidateWithdrawArgs {
  value: NormalizedUnitNumber
  isMaxSelected: boolean
  user: {
    balance: NormalizedUnitNumber
  }
}

export function validateWithdraw({
  value,
  isMaxSelected,
  user: { balance },
}: ValidateWithdrawArgs): WithdrawValidationIssue | undefined {
  if (isMaxSelected) {
    return undefined
  }

  if (value.isLessThanOrEqualTo(0)) {
    return 'value-not-positive'
  }

  if (balance.lt(value)) {
    return 'exceeds-balance'
  }
}

export interface ValidateWithdrawFromSavingsOnBaseArgs extends ValidateWithdrawArgs {
  isUsdcWithdraw: boolean
  psm3: {
    usdsBalance: NormalizedUnitNumber
    usdcBalance: NormalizedUnitNumber
  }
}
export function validateWithdrawFromSavingsOnBase({
  value,
  isUsdcWithdraw,
  isMaxSelected,
  user: { balance },
  psm3: { usdsBalance, usdcBalance },
}: ValidateWithdrawFromSavingsOnBaseArgs): WithdrawValidationIssue | undefined {
  if (isUsdcWithdraw) {
    if (usdcBalance.lt(value)) {
      return 'usdc-withdraw-cap-reached'
    }
  } else {
    if (usdsBalance.lt(value)) {
      return 'usds-withdraw-cap-reached'
    }
  }

  return validateWithdraw({ value, isMaxSelected, user: { balance } })
}

export const withdrawValidationIssueToMessage: Record<WithdrawValidationIssue, string> = {
  'value-not-positive': 'Withdraw value should be positive',
  'exceeds-balance': 'Exceeds your balance',
  'usds-withdraw-cap-reached': 'USDS withdraw cap temporarily reached',
  'usdc-withdraw-cap-reached': 'USDC withdraw cap temporarily reached',
}

export interface getReceiverFormValidatorParams {
  account: Address | undefined
  tokenAddresses: CheckedAddress[]
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getReceiverFormValidator({ account, tokenAddresses }: getReceiverFormValidatorParams) {
  return ReceiverFormSchema.superRefine((field, ctx) => {
    const receiver = field.receiver
    const issue = validateReceiver({
      account: account ? CheckedAddress(account) : undefined,
      tokenAddresses,
      receiver,
    })

    if (issue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: receiverValidationIssueToMessage[issue],
        path: ['receiver'],
      })
    }
  })
}
