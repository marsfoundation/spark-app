import { Address, isAddress } from 'viem'
import * as z from 'zod'
import { CheckedAddress } from '../types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'

// number schemas
export const percentageSchema = z.number().transform((a) => Percentage(a))
export const normalizedUnitNumberSchema = z.union([z.number(), z.string()]).transform((a) => NormalizedUnitNumber(a))

// address schemas
export const checkedAddressSchema = z.string().transform((a) => CheckedAddress(a))
export const viemAddressSchema = z.custom<Address>((address) => isAddress(address as string))
