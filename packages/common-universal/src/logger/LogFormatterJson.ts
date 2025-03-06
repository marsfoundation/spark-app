import { LogEntry, LogFormatter } from './types.js'
import { toJSON } from './utils.js'

export class LogFormatterJson implements LogFormatter {
  public format(entry: LogEntry): string {
    const core = {
      time: entry.time.toISOString(),
      level: entry.level,
      service: entry.service,
      message: entry.message,
      error: entry.resolvedError,
    }

    try {
      return toJSON({ ...core, parameters: entry.parameters })
    } catch {
      return toJSON({ ...core })
    }
  }
}
