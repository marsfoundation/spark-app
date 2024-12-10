import prettyMilliseconds from 'pretty-ms'
import { Logger } from '../logger/Logger.js'

interface TracerOptions {
  service?: string
  externalTrackPerformance: <T>(fullName: string, fn: () => T) => T
}

export class Tracer {
  private readonly logger: Logger
  constructor(
    logger: Logger,
    private readonly options: TracerOptions,
  ) {
    this.logger = logger.configure({ service: Tracer.name })
  }

  for(object: {} | string): Tracer {
    const name = typeof object === 'string' ? object : object.constructor.name
    const service = this.options.service ? `${this.options.service}.${name}` : name

    return new Tracer(this.logger, { ...this.options, service })
  }

  async track<T>(name: string, fn: () => T): Promise<T> {
    const fullName = `[${this.options.service}] ${name}`

    const start = Date.now()
    const result = await this.options.externalTrackPerformance(fullName, fn)
    const durationMs = Date.now() - start

    this.logger.tag(this.options.service).trace(`"${name}" took ${prettyMilliseconds(durationMs)}`)

    return result
  }
}
