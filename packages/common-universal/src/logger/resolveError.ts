import ErrorStackParser from 'error-stack-parser'

export interface ResolvedError {
  name: string
  error: string
  stack: string[]
}

export function resolveError(error: Error, cwd: string | undefined): ResolvedError {
  return {
    name: error.name,
    error: error.message,
    stack: ErrorStackParser.parse(error).map((frame) => formatFrame(frame, cwd)),
  }
}

function formatFrame(frame: StackFrame, cwd: string | undefined): string {
  const file = getFile(frame, cwd)
  const functionName = frame.functionName ? `${frame.functionName} ` : ''

  const fileLocation =
    frame.lineNumber !== undefined && frame.columnNumber !== undefined
      ? `:${frame.lineNumber}:${frame.columnNumber}`
      : ''
  const location = file !== undefined ? `(${file}${fileLocation})` : ''

  return `${functionName}${location}`
}

function getFile(frame: StackFrame, cwd: string | undefined): string | undefined {
  if (!cwd) {
    return frame.fileName
  }
  return frame.fileName?.startsWith(cwd) ? frame.fileName.slice(cwd.length) : frame.fileName
}
