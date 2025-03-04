import { MockObject, expect, mockFn, mockObject } from 'earl'
import { ZodError, z } from 'zod'
import { Logger } from '../logger/index.js'
import { HttpClient } from './HttpClient.js'
import { HttpServerMock, PostBody, getResponseSchema, postBodySchema } from './HttpServer.mock.js'

describe(HttpClient.name, () => {
  let httpServer: HttpServerMock

  beforeEach(() => {
    httpServer = new HttpServerMock()
    httpServer.listen()
  })

  afterEach(() => httpServer.server?.close())

  describe(HttpClient.prototype.get.name, () => {
    it('returns successful response', async () => {
      const httpClient = new HttpClient(Logger.SILENT)
      const response = await httpClient.get(httpServer.getUrl('/status?status=200'), getResponseSchema)

      expect(response).toEqual({ status: 200 })
    })

    it('logs request', async () => {
      const url = httpServer.getUrl('/status?status=200')
      const logger = getMockLogger()
      const httpClient = new HttpClient(logger)

      await httpClient.get(url, getResponseSchema)
      expect(logger.info).toHaveBeenOnlyCalledWith('[HttpClient] GET request', { url })
    })

    it('throws with invalid schema', async () => {
      const httpClient = new HttpClient(Logger.SILENT)
      const invalidSchema = z.object({
        invalid: z.boolean(),
      })

      await expect(() => httpClient.get(httpServer.getUrl('/status?status=200'), invalidSchema)).toBeRejectedWith(
        ZodError,
      )
    })

    it('retries in case of server error', async () => {
      const httpClient = new HttpClient(Logger.SILENT)
      await expect(() => httpClient.get(httpServer.getUrl('/status?status=500'), getResponseSchema)).toBeRejectedWith(
        'Failed GET: 500 - {"status":500}',
      )
      expect(httpServer.requestsCount['/status']).toEqual(6)
    })
  })

  describe(HttpClient.prototype.post.name, () => {
    it('returns response', async () => {
      const httpClient = new HttpClient(Logger.SILENT)
      const body: PostBody = {
        status: 200,
      }

      expect(await httpClient.post(httpServer.getUrl('/post'), body, postBodySchema)).toEqual(body)
    })

    it('logs request', async () => {
      const url = httpServer.getUrl('/post')
      const logger = getMockLogger()
      const httpClient = new HttpClient(logger)
      const body: PostBody = {
        status: 200,
      }

      expect(await httpClient.post(url, body, postBodySchema)).toEqual(body)
      expect(logger.info).toHaveBeenOnlyCalledWith('[HttpClient] POST request', { url, body })
    })

    it('throws with invalid schema', async () => {
      const httpClient = new HttpClient(Logger.SILENT)
      const body: PostBody = {
        status: 200,
      }
      const invalidSchema = z.object({
        invalid: z.boolean(),
      })

      await expect(() => httpClient.post(httpServer.getUrl('/post'), body, invalidSchema)).toBeRejectedWith(ZodError)
    })

    it('retries in case of server error', async () => {
      const httpClient = new HttpClient(Logger.SILENT)
      const body: PostBody = {
        status: 500,
      }

      await expect(() => httpClient.post(httpServer.getUrl('/post'), body, postBodySchema)).toBeRejectedWith(
        'Failed POST: 500 - {"status":500}',
      )
      expect(httpServer.requestsCount['/post']).toEqual(6)
    })
  })
})

function getMockLogger(): MockObject<Logger> {
  const mockLogger = mockObject<Logger>({
    info: mockFn(() => {}),
    for: (_): Logger => mockLogger,
  })
  return mockLogger
}
