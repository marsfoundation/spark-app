import { Percentage } from '@/domain/types/NumericValues'

import { EvaluateResult, LifiQueryMetaEvaluator } from '.'

export class MockLifiQueryMetaEvaluator implements LifiQueryMetaEvaluator {
  evaluate(): EvaluateResult {
    return {
      meta: {
        fee: Percentage(0),
        integratorKey: 'spark_test',
      },
      paramOverrides: {},
    }
  }
}
