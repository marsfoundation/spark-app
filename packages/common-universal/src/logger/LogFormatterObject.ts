import { omitBy } from 'remeda'
import { LogEntry, LogFormatter } from './types.js'

export class LogFormatterObject implements LogFormatter {
  public format(entry: LogEntry): object {
    const core = {
      time: entry.time.toISOString(),
      level: entry.level,
      service: entry.service,
      message: entry.message,
      error: entry.resolvedError,
    }
    const filteredCore = omitBy(core, (value) => !value)

    return entry.parameters ? { ...filteredCore, parameters: entry.parameters } : filteredCore
  }
}
