import * as z from 'zod'

export const dateSchema = z.string().transform((value) => new Date(value))
