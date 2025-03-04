import { z } from 'zod'
import { Logger } from '../logger/index.js'
import { RetryOptions, defaultRetryOptions, fetchWithRetries } from './fetchWithRetries.js'

export class HttpClient {
  private readonly logger: Logger
  private readonly retryOptions: RetryOptions
  constructor(logger: Logger, retryOptions?: Partial<RetryOptions>) {
    this.logger = logger.for(this)
    this.retryOptions = {
      delay: retryOptions?.delay ?? defaultRetryOptions.delay,
      maxCalls: retryOptions?.maxCalls ?? defaultRetryOptions.maxCalls,
      isRetryableStatus: retryOptions?.isRetryableStatus ?? defaultRetryOptions.isRetryableStatus,
      isRetryableError: retryOptions?.isRetryableError ?? defaultRetryOptions.isRetryableError,
    }
  }

  async post<T extends z.ZodTypeAny>(url: string, body: object, schema: T): Promise<z.infer<T>> {
    this.logger.info('[HttpClient] POST request', { url, body })

    const result = await fetchWithRetries(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
      this.retryOptions,
    )
    if (!result.ok) {
      throw new Error(`Failed POST: ${result.status} - ${await result.text()}`)
    }

    return schema.parse(await result.json())
  }

  async get<T extends z.ZodTypeAny>(url: string, schema: T): Promise<z.infer<T>> {
    this.logger.info('[HttpClient] GET request', { url })
    const result = await fetchWithRetries(url, {}, this.retryOptions)
    if (!result.ok) {
      throw new Error(`Failed GET: ${result.status} - ${await result.text()}`)
    }
    return schema.parse(await result.json())
  }
}
