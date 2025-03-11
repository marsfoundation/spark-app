import { QueryFunction, QueryKey, UseSuspenseQueryResult } from '@tanstack/react-query'

export interface QueryOptions<TQueryFnData = unknown, TQueryKey extends QueryKey = QueryKey> {
  queryKey: TQueryKey
  queryFn: QueryFunction<TQueryFnData, TQueryKey>
}

export type SuspenseQueryWith<R> = Omit<UseSuspenseQueryResult<unknown>, 'data'> & R

// removes all keys from T that are not assignable to F
export type FilterObjectValues<T, F> = T extends Object ? { [K in keyof T as T[K] extends F ? K : never]: T[K] } : never

export type RequireKeys<T extends object, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

export type Serializable<T> = T extends string | boolean | number
  ? T
  : T extends () => any
    ? never
    : T extends object
      ? {
          [K in keyof T]: Serializable<T[K]>
        }
      : T extends any[]
        ? Serializable<T[number]>[]
        : never

type RequiredKeys<T> = { [K in keyof T]: T[K] extends null | undefined ? never : K }[keyof T]
export type RequiredProps<T> = { [K in RequiredKeys<T>]: Exclude<T[K], null | undefined> }
