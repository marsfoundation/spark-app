import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface Projections {
  thirtyDays: NormalizedUnitNumber
  oneYear: NormalizedUnitNumber
}

export type AccountType = 'susds' | 'susdc' | 'sdai'
