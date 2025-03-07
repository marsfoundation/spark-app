export class HandledWriteError extends Error {
  constructor(error: Error) {
    super(error.message)
    this.name = 'HandledWriteError'
  }
}
