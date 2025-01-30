import { raise } from '../assert/assert.js'
import { AnyViemClient } from './types.js'

export function extractUrlFromClient(client: AnyViemClient): string {
  return client.transport.type === 'http' ? client.transport.url : raise('Only http transport is supported')
}
