import { mergeDeep } from 'remeda'
import { ZodString, z } from 'zod'
import { Logger } from '../logger/Logger.js'
import { RetryOptions, defaultRetryOptions, fetchRetry } from './fetchRetry.js'

export class HttpClient {
  private readonly logger: Logger
  private readonly fetchWithRetries: typeof fetch
  constructor(logger: Logger, retryOptions: Partial<RetryOptions> = {}) {
    this.logger = logger.for(this)
    const options = mergeDeep(defaultRetryOptions, retryOptions) as RetryOptions
    this.fetchWithRetries = fetchRetry(options)
  }

  async post<T extends z.ZodTypeAny>(
    url: string,
    body: object,
    schema: T,
    headers: Record<string, string> = applicationJsonHeader,
  ): Promise<z.infer<T>> {
    this.logger.trace(`[HttpClient] POST request - ${url}`, { url, body })

    const result = await this.fetchWithRetries(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    if (!result.ok) {
      throw new HttpError('POST', url, result.status, await result.text())
    }

    if (schema instanceof ZodString) {
      return await result.text()
    }
    return schema.parse(await result.json())
  }

  async get<T extends z.ZodTypeAny>(url: string, schema: T, headers?: Record<string, string>): Promise<z.infer<T>> {
    this.logger.trace(`[HttpClient] GET request - ${url}`, { url })
    const result = await this.fetchWithRetries(url, {
      method: 'GET',
      headers,
    })
    if (!result.ok) {
      throw new HttpError('GET', url, result.status, await result.text())
    }

    if (schema instanceof ZodString) {
      return schema.parse(await result.text())
    }
    return schema.parse(await result.json())
  }
}

export class HttpError extends Error {
  constructor(
    public readonly method: 'POST' | 'GET',
    public readonly url: string,
    public readonly status: number,
    public readonly textResult: string,
  ) {
    super(`Failed ${method} ${url}: ${status} - ${textResult}`)
    this.name = 'HttpError'
  }
}

const applicationJsonHeader = {
  'Content-Type': 'application/json',
}
