import { CheckedAddress } from '@marsfoundation/common-universal'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import BigNumber from 'bignumber.js'
import { Address, isAddress } from 'viem'
import * as z from 'zod'

// number schemas
export const numberLikeSchema = z.union([
  z.string(),
  z.number(),
  z.custom<BigNumber>((val) => BigNumber.isBigNumber(val), {
    message: 'Must be a valid BigNumber',
  }),
  z.bigint(),
])
export const percentageSchema = numberLikeSchema.transform((a) => Percentage(a))
export const percentageAboveOneSchema = numberLikeSchema.transform((a) => Percentage(a, { allowMoreThan1: true }))
export const normalizedUnitNumberSchema = numberLikeSchema.transform((a) => NormalizedUnitNumber(a))
export const normalizedNumberSchema = numberLikeSchema.transform((a) => NormalizedUnitNumber(a).toNumber())

// address schemas
export const checkedAddressSchema = z.string().transform((a) => CheckedAddress(a))
export const viemAddressSchema = z.custom<Address>((address) => isAddress(address as string))
