import { bigNumberify } from '@/utils/bigNumber'

import { Percentage } from '../types/NumericValues'
import { healthFactorToLtv } from './math'

describe(healthFactorToLtv.name, () => {
  it('calculates ltv', () => {
    const healthFactor = bigNumberify(10)
    const liquidationThreshold = Percentage(0.8)

    const result = healthFactorToLtv(healthFactor, liquidationThreshold)

    expect(result).toEqual(Percentage(0.08))
  })
})
