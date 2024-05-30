import { CustomTransport, custom } from 'viem'

import { MockError } from './handlers'
import { RpcHandler, RpcResponse } from './types'

export { handlers } from './handlers'

export function makeMockTransport(matchers: RpcHandler[]): CustomTransport {
  return custom(
    {
      request: async ({ method, params }): Promise<RpcResponse> => {
        try {
          for (const matcher of matchers) {
            // @note: we pass empty array so we can destruct it in the matcher
            const result = matcher(method, params || [])

            if (result !== undefined) {
              return result
            }
          }
        } catch (e) {
          if (e instanceof MockError) {
            throw e
          }
          console.error('Error while mocking RPC call:', e)
        }
        console.error('RPC request not handled:', method, params)
        throw new Error(`RPC request not handled: ${method}`)
      },
    },
    { retryCount: 0 },
  )
}
