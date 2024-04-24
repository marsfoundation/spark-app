import { Opaque } from './types'

export type EnsName = Opaque<string, 'EnsName'>
export function EnsName(value: string): EnsName {
  return value as EnsName
}
