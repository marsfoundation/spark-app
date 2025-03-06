import { LogLevel } from './LogLevel.js'
import { ResolvedError } from './resolveError.js'

export interface LoggerTransport {
  debug(message: string | object): void
  log(message: string | object): void
  warn(message: string | object): void
  error(message: string | object): void
}

export interface LogFormatter {
  format(entry: LogEntry): string | object
}

export interface LoggerTransportOptions {
  transport: LoggerTransport
  formatter: LogFormatter
}

export interface LoggerOptions {
  logLevel: LogLevel
  service?: string
  tag?: string
  utc: boolean
  getTime: () => Date
  reportError: (entry: LogEntry) => void
  transports: LoggerTransportOptions[]
}

export interface LogEntry {
  level: LogLevel
  time: Date
  service?: string
  message?: string
  error?: Error
  resolvedError?: ResolvedError
  parameters?: object
}
