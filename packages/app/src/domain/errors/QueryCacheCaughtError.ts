export class QueryCacheCaughtError extends Error {
  constructor(error: Error) {
    super(error.message)
    this.name = 'QueryCacheCaughtError'
  }
}
