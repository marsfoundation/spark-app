export * from './MockLifiQueryMetaEvaluator'
export * from './RealLifiQueryMetaEvaluator'
export * from './useLifiQueryMetaEvaluator'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Percentage } from '@/domain/types/NumericValues'

import { GetQuoteOptions } from '../lifi'

export interface LifiQuoteMeta {
  integratorKey: string
  fee: Percentage
}

export interface EvaluateParams {
  fromToken: CheckedAddress
  toToken: CheckedAddress
}

export interface EvaluateResult {
  meta: LifiQuoteMeta
  paramOverrides: Partial<Pick<GetQuoteOptions, 'allowExchanges'>>
}

/**
 * Evaluates the meta parameters (fee, integrator string) for a given query
 */
export interface LifiQueryMetaEvaluator {
  evaluate(params: EvaluateParams): EvaluateResult
}
