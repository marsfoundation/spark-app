import { UseQueryOptions } from '@tanstack/react-query'

export type ReadHookParams<TData = unknown> = Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
