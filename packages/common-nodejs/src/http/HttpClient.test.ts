import { Server } from 'node:http'
import { assert } from '@marsfoundation/common-universal'
import { expect } from 'earl'
import express, { Express } from 'express'
import { ZodError, z } from 'zod'
import { Logger } from '../logger/index.js'
import { HttpClient } from './HttpClient.js'

class HttpServerMock {
  public app: Express
  public server: Server | undefined = undefined
  public requestsCount: Record<string, number>

  constructor() {
    this.app = express()
    this.requestsCount = {}

    this.app.use(express.json())
    this.app.use((req, _res, next) => {
      this.requestsCount[req.path] = (this.requestsCount[req.path] ?? 0) + 1
      next()
    })

    this.app.get('/status', (req, res) => {
      const status = Number(req.query.status)
      res.status(status).json({ status })
    })

    this.app.post('/post', (req, res) => {
      const bodySafeParse = postSchema.safeParse(req.body)
      if (!bodySafeParse.success) {
        res.status(404).end()
        return
      }
      res.status(bodySafeParse.data.status).json(bodySafeParse.data)
    })
  }

  listen() {
    this.server = this.app.listen(0)
  }

  getUrl(path: string) {
    const address = this.server?.address()
    assert(address)

    if (typeof address === 'string') {
      return address
    }
    return `http://127.0.0.1:${address.port}${path}`
  }
}

const responseSchema = z.object({
  status: z.number(),
})

const postSchema = z.object({
  status: z.number(),
})
type PostSchema = z.infer<typeof postSchema>

describe(HttpClient.name, () => {
  let httpServer: HttpServerMock

  beforeEach(() => {
    httpServer = new HttpServerMock()
    httpServer.listen()
  })

  afterEach(() => httpServer.server?.close())

  describe('get', () => {
    it('returns successful response', async () => {
      const httpClient = new HttpClient(new Logger({}))
      const response = await httpClient.get(httpServer.getUrl('/status?status=200'), responseSchema)
      expect(response).toEqual({ status: 200 })
    })

    it('throws with invalid schema', async () => {
      const httpClient = new HttpClient(new Logger({}))
      const invalidSchema = z.object({
        invalid: z.boolean(),
      })
      await expect(() => httpClient.get(httpServer.getUrl('/status?status=200'), invalidSchema)).toBeRejectedWith(
        ZodError,
      )
    })

    it('retries in case of server error', async () => {
      const httpClient = new HttpClient(new Logger({}))
      await expect(() => httpClient.get(httpServer.getUrl('/status?status=500'), responseSchema)).toBeRejectedWith(
        'Failed GET: 500 - {"status":500}',
      )
      expect(httpServer.requestsCount['/status']).toEqual(6)
    })
  })

  describe('post', () => {
    it('returns undefined if no schema provided', async () => {
      const httpClient = new HttpClient(new Logger({}))
      const body: PostSchema = {
        status: 200,
      }

      expect(await httpClient.post(httpServer.getUrl('/post'), body)).toEqual(undefined)
    })

    it('returns response', async () => {
      const httpClient = new HttpClient(new Logger({}))
      const body: PostSchema = {
        status: 200,
      }

      expect(await httpClient.post(httpServer.getUrl('/post'), body, postSchema)).toEqual(body)
    })

    it('throws with invalid schema', async () => {
      const httpClient = new HttpClient(Logger.SILENT)
      const body: PostSchema = {
        status: 200,
      }
      const invalidSchema = z.object({
        invalid: z.boolean(),
      })

      await expect(() => httpClient.post(httpServer.getUrl('/post'), body, invalidSchema)).toBeRejectedWith(ZodError)
    })

    it('retries in case of server error', async () => {
      const httpClient = new HttpClient(new Logger({}))
      const body: PostSchema = {
        status: 500,
      }
      await expect(() => httpClient.post(httpServer.getUrl('/post'), body)).toBeRejectedWith(
        'Failed POST: 500 - {"status":500}',
      )
      expect(httpServer.requestsCount['/post']).toEqual(6)
    })
  })
})
