import { Address, isAddress } from 'viem'
import { z, ZodBigIntDef, ZodType } from 'zod'

const callDataSchema = z.custom<`0x${string}`>((address) => /^0x[0-9a-fA-F]{8,}$/.test(address as string))
const addressSchema = z.custom<Address>((address) => isAddress(address as string))
const bigIntSchema = z.coerce.bigint() as any as ZodType<bigint, ZodBigIntDef, string> // we coerce strings to bigints. Explicit ZodType makes input type inference work (zod.input)

const feesSchema = z.array(z.object({ amountUSD: z.coerce.number() }))
const lifiTokenSchema = z.object({
  address: addressSchema,
})

export const quoteResponseSchema = z.object({
  transactionRequest: z.object({
    data: callDataSchema,
    from: addressSchema,
    gasLimit: bigIntSchema,
    gasPrice: bigIntSchema,
    to: addressSchema,
    value: bigIntSchema,
  }),
  estimate: z.object({
    feeCosts: feesSchema,
    fromAmount: bigIntSchema,
    toAmount: bigIntSchema,
  }),
  action: z.object({
    toToken: lifiTokenSchema,
    fromToken: lifiTokenSchema,
  }),
})

export const reverseQuoteResponseSchema = quoteResponseSchema
