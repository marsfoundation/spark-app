import invariant from 'tiny-invariant'

export function clientEnv(key: string): string {
  const value = import.meta.env[key]
  invariant(value, `${key} env not defined`)

  return value
}

clientEnv.boolean = (key: string): boolean => {
  const value = import.meta.env[key]
  return value === '1'
}
