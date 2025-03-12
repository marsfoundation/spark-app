import { omitBy } from 'remeda'
import { LogEntry, LogFormatter } from './types.js'

export class LogFormatterObject implements LogFormatter {
  public format(entry: LogEntry): object {
    const data = {
      time: entry.time.toISOString(),
      level: entry.level,
      service: entry.service,
      message: entry.message,
      error: entry.resolvedError,
      parameters: entry.parameters,
    }
    return omitBy(data, (value) => !value)
  }
}
