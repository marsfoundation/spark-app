export class NotConnectedError extends Error {
  constructor() {
    super('User wallet is not connected')
    this.name = 'NotConnectedError'
  }
}
