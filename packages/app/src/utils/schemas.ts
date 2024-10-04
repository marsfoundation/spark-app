import * as z from 'zod'

export const dateSchema = z.coerce.date()
