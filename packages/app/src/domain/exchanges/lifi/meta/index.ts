export * from './MockLifiQueryMetaEvaluator'
export * from './RealLifiQueryMetaEvaluator'
export * from './useLifiQueryMetaEvaluator'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Percentage } from '@/domain/types/NumericValues'

export interface LifiQuoteMeta {
  integratorKey: string
  fee: Percentage
}

export interface EvaluateParams {
  fromToken: CheckedAddress
  toToken: CheckedAddress
}

/**
 * Evaluates the meta parameters (fee, integrator string) for a given query
 */
export interface LifiQueryMetaEvaluator {
  evaluate(params: EvaluateParams): LifiQuoteMeta
}
