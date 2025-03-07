import { LogEntry, LogFormatter } from './types.js'

export class LogFormatterObject implements LogFormatter {
  public format(entry: LogEntry): object {
    const core = {
      time: entry.time.toISOString(),
      level: entry.level,
      ...(entry.service && { service: entry.service }),
      ...(entry.message && { message: entry.message }),
      ...(entry.resolvedError && { error: entry.resolvedError }),
    }

    return { ...core, parameters: entry.parameters }
  }
}
