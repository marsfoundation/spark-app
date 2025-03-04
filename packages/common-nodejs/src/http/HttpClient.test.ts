import { expect } from 'earl'
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

  describe('get', () => {
    it('returns successful response', async () => {
      const httpClient = new HttpClient(Logger.SILENT)
      const response = await httpClient.get(httpServer.getUrl('/status?status=200'), getResponseSchema)
      expect(response).toEqual({ status: 200 })
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

  describe('post', () => {
    it('returns undefined if no schema provided', async () => {
      const httpClient = new HttpClient(Logger.SILENT)
      const body: PostBody = {
        status: 200,
      }

      expect(await httpClient.post(httpServer.getUrl('/post'), body)).toEqual(undefined)
    })

    it('returns response', async () => {
      const httpClient = new HttpClient(Logger.SILENT)
      const body: PostBody = {
        status: 200,
      }

      expect(await httpClient.post(httpServer.getUrl('/post'), body, postBodySchema)).toEqual(body)
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
      await expect(() => httpClient.post(httpServer.getUrl('/post'), body)).toBeRejectedWith(
        'Failed POST: 500 - {"status":500}',
      )
      expect(httpServer.requestsCount['/post']).toEqual(6)
    })
  })
})
