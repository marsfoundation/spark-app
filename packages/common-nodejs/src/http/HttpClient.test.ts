import { Server } from 'node:http'
import { assert } from '@marsfoundation/common-universal'
import { expect } from 'earl'
import express, { Express } from 'express'
import { z } from 'zod'
import { Logger } from '../logger/index.js'
import { HttpClient } from './HttpClient.js'

class HttpServerMock {
  private app: Express
  public server: Server | undefined = undefined
  public requestCount: Record<string, number>

  constructor() {
    this.app = express()
    this.requestCount = {}

    this.app.use((req, _res, next) => {
      this.requestCount[req.path] = (this.requestCount[req.path] ?? 0) + 1
      next()
    })
    this.app.get('/status', (req, res) => {
      const status = Number(req.query.status)
      res.status(status).json({ status })
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

describe(HttpClient.name, () => {
  let httpServer: HttpServerMock

  beforeEach(() => {
    httpServer = new HttpServerMock()
    httpServer.listen()
  })

  afterEach(() => httpServer.server?.close())

  it('returns successful response', async () => {
    const httpClient = new HttpClient(new Logger({}))
    const response = await httpClient.get(httpServer.getUrl('/status?status=200'), responseSchema)
    expect(response).toEqual({ status: 200 })
  })

  it('retries in case of server error', async () => {
    const httpClient = new HttpClient(new Logger({}))
    await expect(() => httpClient.get(httpServer.getUrl('/status?status=500'), responseSchema)).toBeRejected()
    expect(httpServer.requestCount['/status']).toEqual(6)
  })
})
