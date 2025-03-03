import { z } from 'zod'

import { SolidFetch, solidFetch as _solidFetch } from '@marsfoundation/common-universal'
import { Logger } from '../logger/index.js'

// @todo add better error handling and retries
// @todo add tests

export class HttpClient {
  private readonly logger: Logger
  constructor(
    logger: Logger,
    private readonly solidFetch: SolidFetch = _solidFetch,
  ) {
    this.logger = logger.for(this)
  }

  async post<T extends z.ZodTypeAny>(url: string, body: object, schema: T): Promise<z.infer<T>>
  async post(url: string, body: object): Promise<undefined>

  async post<T extends z.ZodTypeAny>(url: string, body: object, schema?: T): Promise<z.infer<T> | undefined> {
    this.logger.info('[HttpClient] POST request', { url, body })
    const result = await this.solidFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!result.ok) throw new Error(`Failed POST: ${result.status} - ${await result.text()}`)

    if (!schema) {
      return undefined
    }

    return schema.parse(await result.json())
  }

  async get<T extends z.ZodTypeAny>(url: string, schema: T): Promise<z.infer<T>> {
    this.logger.info('[HttpClient] GET request', { url })
    const result = await this.solidFetch(url)
    if (!result.ok) throw new Error(`Failed GET: ${result.status} - ${await result.text()}`)
    return schema.parse(await result.json())
  }
}
