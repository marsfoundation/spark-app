import { Percentage } from '@/domain/types/NumericValues'

import { LifiQueryMetaEvaluator, LifiQuoteMeta } from '.'

export class MockLifiQueryMetaEvaluator implements LifiQueryMetaEvaluator {
  evaluate(): LifiQuoteMeta {
    return {
      fee: Percentage(0),
      integratorKey: 'spark_test',
    }
  }
}
