// https://github.com/vitest-dev/vitest/issues/4043#issuecomment-1905172846

if (import.meta.env.MODE === 'test') {
  class ESBuildAndJSDOMCompatibleTextEncoder extends TextEncoder {
    encode(input: string): Uint8Array {
      if (typeof input !== 'string') {
        throw new TypeError('`input` must be a string')
      }

      const decodedURI = decodeURIComponent(encodeURIComponent(input))
      const arr = new Uint8Array(decodedURI.length)
      const chars = decodedURI.split('')
      for (let i = 0; i < chars.length; i++) {
        arr[i] = decodedURI[i]!.charCodeAt(0)
      }
      return arr
    }
  }

  Object.defineProperty(global, 'TextEncoder', {
    value: ESBuildAndJSDOMCompatibleTextEncoder,
    writable: true,
  })
}
