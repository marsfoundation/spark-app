export type EnsureFieldNotUndefined<T, K extends keyof T> = T & Required<{ [P in K]: Exclude<T[P], undefined> }>

// https://stackoverflow.com/questions/48953587/typescript-class-implements-class-with-private-functions
export type PublicInterface<T> = { [K in keyof T]: T[K] }

// useful for type-level assertions
export type Expect<T extends true> = T
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
