import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export type AccountType = 'susds' | 'susdc' | 'sdai'

export interface Projections {
  thirtyDays: NormalizedUnitNumber
  oneYear: NormalizedUnitNumber
}
