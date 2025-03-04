import { Server } from 'node:http'
import { assert } from '@marsfoundation/common-universal'
import express, { Express } from 'express'
import { z } from 'zod'

export class HttpServerMock {
  public app: Express
  public server: Server | undefined = undefined
  public requestsCount: Record<string, number>

  constructor() {
    this.app = express()
    this.requestsCount = {}
    this.setupDefaultRoutes()
  }

  listen(): void {
    this.server = this.app.listen(0)
  }

  getUrl(path: string): string {
    const address = this.server?.address()
    assert(address)

    if (typeof address === 'string') {
      return address
    }
    return `http://127.0.0.1:${address.port}${path}`
  }

  private setupDefaultRoutes(): void {
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
      const bodySafeParse = postBodySchema.safeParse(req.body)
      if (!bodySafeParse.success) {
        res.status(404).end()
        return
      }
      res.status(bodySafeParse.data.status).json(bodySafeParse.data)
    })
  }
}

export const getResponseSchema = z.object({
  status: z.number(),
})

export const postBodySchema = z.object({
  status: z.number(),
})
export type PostBody = z.infer<typeof postBodySchema>
