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

    return { ...core, parameters: entry.parameters }
  }
}
