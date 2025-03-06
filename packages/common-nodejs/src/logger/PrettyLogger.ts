import { Logger, LoggerOptions } from '@marsfoundation/common-universal/logger'
import { LogFormatterPretty } from './LogFormatterPretty.js'

export class PrettyLogger extends Logger {
  constructor(options: Partial<LoggerOptions>) {
    options.transports = options.transports ?? [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ]
    super(options)
  }

  static CRITICAL = new Logger({
    logLevel: 'CRITICAL',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })

  static ERROR = new Logger({
    logLevel: 'ERROR',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })

  static WARN = new Logger({
    logLevel: 'WARN',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })

  static INFO = new Logger({
    logLevel: 'INFO',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })

  static DEBUG = new Logger({
    logLevel: 'DEBUG',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })

  static TRACE = new Logger({
    logLevel: 'TRACE',
    transports: [
      {
        transport: console,
        formatter: new LogFormatterPretty(),
      },
    ],
  })
}
