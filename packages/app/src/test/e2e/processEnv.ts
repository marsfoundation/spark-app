import invariant from 'tiny-invariant'

export function processEnv(key: string): string {
  const value = process.env[key]
  invariant(value, `${key} env not defined`)

  return value
}

processEnv.optionalBoolean = (key: string): boolean => {
  const value = process.env[key]
  return value === '1' || value === 'true'
}
