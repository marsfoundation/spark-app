type Promised<T> = { [P in keyof T]: PromiseLike<T[P]> }

export async function promiseAll<T>(o: Promised<T>): Promise<T> {
  const keys = Object.keys(o) as (keyof T)[]
  const promises = keys.map((key) => o[key])

  const values = await Promise.all(promises)

  const result = {} as T
  keys.forEach((key, index) => {
    result[key] = values[index] as T[keyof T]
  })

  return result
}
