export class NotFoundError extends Error {
  constructor() {
    super('The requested page could not be found.')
    this.name = 'NotFoundError'
  }
}
