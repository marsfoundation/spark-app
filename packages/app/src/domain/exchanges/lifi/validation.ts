import { ZodBigIntDef, ZodType, z } from 'zod'

import { percentageSchema, viemAddressSchema } from '@/domain/common/validation'

const callDataSchema = z.custom<`0x${string}`>((address) => /^0x[0-9a-fA-F]{8,}$/.test(address as string))
const bigIntSchema = z.coerce.bigint() as any as ZodType<bigint, ZodBigIntDef, string> // we coerce strings to bigints. Explicit ZodType makes input type inference work (zod.input)

const feesSchema = z.array(z.object({ amountUSD: z.coerce.number() }))
const lifiTokenSchema = z.object({
  address: viemAddressSchema,
})

export const quoteResponseSchema = z.object({
  transactionRequest: z.object({
    data: callDataSchema,
    from: viemAddressSchema,
    gasLimit: bigIntSchema,
    gasPrice: bigIntSchema,
    to: viemAddressSchema,
    value: bigIntSchema,
  }),
  estimate: z.object({
    feeCosts: feesSchema,
    fromAmount: bigIntSchema,
    toAmount: bigIntSchema,
    toAmountMin: bigIntSchema,
  }),
  action: z.object({
    toToken: lifiTokenSchema,
    fromToken: lifiTokenSchema,
    slippage: percentageSchema,
  }),
})

export const reverseQuoteResponseSchema = quoteResponseSchema
