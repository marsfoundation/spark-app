import BigNumber from 'bignumber.js'
import { Address, isAddress } from 'viem'
import * as z from 'zod'
import { CheckedAddress } from '../types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'

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
export const percentageAboveOneSchema = numberLikeSchema.transform((a) => Percentage(a, true))
export const normalizedUnitNumberSchema = numberLikeSchema.transform((a) => NormalizedUnitNumber(a))

// address schemas
export const checkedAddressSchema = z.string().transform((a) => CheckedAddress(a))
export const viemAddressSchema = z.custom<Address>((address) => isAddress(address as string))
