import { z } from 'zod'
import { Logger } from '../logger/index.js'
import { RetryOptions, defaultRetryOptions, fetchRetry } from './fetchWithRetries.js'

export class HttpClient {
  private readonly logger: Logger
  private readonly fetchWithRetries: typeof fetch
  constructor(logger: Logger, retryOptions?: Partial<RetryOptions>) {
    this.logger = logger.for(this)
    this.fetchWithRetries = fetchRetry({
      delay: retryOptions?.delay ?? defaultRetryOptions.delay,
      maxCalls: retryOptions?.maxCalls ?? defaultRetryOptions.maxCalls,
      isRetryableStatus: retryOptions?.isRetryableStatus ?? defaultRetryOptions.isRetryableStatus,
    })
  }

  async post<T extends z.ZodTypeAny>(url: string, body: object, schema: T): Promise<z.infer<T>> {
    this.logger.info('[HttpClient] POST request', { url, body })

    const result = await this.fetchWithRetries(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!result.ok) {
      throw new Error(`Failed POST: ${result.status} - ${await result.text()}`)
    }

    return schema.parse(await result.json())
  }

  async get<T extends z.ZodTypeAny>(url: string, schema: T): Promise<z.infer<T>> {
    this.logger.info('[HttpClient] GET request', { url })
    const result = await this.fetchWithRetries(url)
    if (!result.ok) {
      throw new Error(`Failed GET: ${result.status} - ${await result.text()}`)
    }
    return schema.parse(await result.json())
  }
}
