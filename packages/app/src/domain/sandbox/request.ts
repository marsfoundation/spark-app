import { randomInt } from '@/utils/random'
import { HttpClient } from '@marsfoundation/common-universal/http-client'
import { Logger } from '@marsfoundation/common-universal/logger'
import { z } from 'zod'

export async function request(
  forkUrl: string,
  method: 'tenderly_setBalance',
  params: [string, string],
): Promise<unknown>
export async function request(
  forkUrl: string,
  method: 'tenderly_setErc20Balance',
  params: [string, string, string],
): Promise<unknown>
export async function request(forkUrl: string, method: string, params: any[]): Promise<unknown> {
  const id = randomInt().toString()
  const httpClient = new HttpClient(Logger.BROWSER)

  return httpClient.post(
    forkUrl,
    {
      jsonrpc: '2.0',
      method,
      params,
      id,
    },
    z.unknown(),
  )
}
