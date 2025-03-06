import ErrorStackParser from 'error-stack-parser'

export interface ResolvedError {
  name: string
  error: string
  stack: string[]
}

export function resolveError(error: Error): ResolvedError {
  return {
    name: error.name,
    error: error.message,
    stack: ErrorStackParser.parse(error).map((frame) => formatFrame(frame)),
  }
}

function formatFrame(frame: StackFrame): string {
  const functionName = frame.functionName ? `${frame.functionName} ` : ''

  const fileLocation =
    frame.lineNumber !== undefined && frame.columnNumber !== undefined
      ? `:${frame.lineNumber}:${frame.columnNumber}`
      : ''
  const location = frame.fileName !== undefined ? `(${frame.fileName}${fileLocation})` : ''

  return `${functionName}${location}`
}
