import { bigNumberify } from '@marsfoundation/common-universal'

import { Percentage } from '@marsfoundation/common-universal'
import { healthFactorToLtv } from './math'

describe(healthFactorToLtv.name, () => {
  it('calculates ltv', () => {
    const healthFactor = bigNumberify(10)
    const liquidationThreshold = Percentage(0.8)

    const result = healthFactorToLtv(healthFactor, liquidationThreshold)

    expect(result).toEqual(Percentage(0.08))
  })
})
