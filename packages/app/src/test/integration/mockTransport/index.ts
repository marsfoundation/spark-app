import { custom, CustomTransport } from 'viem'

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
          // eslint-disable-next-line no-console
          console.error('Error while mocking RPC call:', e)
        }
        // eslint-disable-next-line no-console
        console.error('RPC request not handled:', method, params)
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        throw new Error(`RPC request not handled: ${method}`)
      },
    },
    { retryCount: 0 },
  )
}
