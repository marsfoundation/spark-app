import { queryOptions } from '@tanstack/react-query'

import { CheckedAddress } from '@marsfoundation/common-universal'

import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { base } from 'viem/chains'
import { Psm3MyEarningsDataResponseSchema, psm3SavingsMyEarningsQueryOptions } from './psm3-savings'
import { MyEarningsResult } from './types'

function susdsSelectQuery(data: Psm3MyEarningsDataResponseSchema): MyEarningsResult {
  return data.map(({ date, balance }) => ({ date, balance: balance ?? NormalizedUnitNumber(0) }))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function baseSusdsMyEarningsQueryOptions(wallet: CheckedAddress) {
  return queryOptions({
    ...psm3SavingsMyEarningsQueryOptions(wallet, base.id),
    select: susdsSelectQuery,
  })
}

function baseSusdcSelectQuery(data: Psm3MyEarningsDataResponseSchema): MyEarningsResult {
  return data.map(({ date, susdcBalance }) => ({ date, balance: susdcBalance ?? NormalizedUnitNumber(0) }))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function baseSusdcMyEarningsQueryOptions(wallet: CheckedAddress) {
  return queryOptions({
    ...psm3SavingsMyEarningsQueryOptions(wallet, base.id),
    select: baseSusdcSelectQuery,
  })
}
