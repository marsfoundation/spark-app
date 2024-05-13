import { QueryKey } from '@tanstack/react-query'
import { Config } from 'wagmi'

import { Percentage } from '../types/NumericValues'

export interface SavingsAPYParams {
  wagmiConfig: Config
}

export interface SavingsAPYQueryOptions {
  queryKey: QueryKey
  queryFn: () => Promise<Percentage>
}

export type SavingsAPYQueryOptionsFactory = ({ wagmiConfig }: SavingsAPYParams) => SavingsAPYQueryOptions
