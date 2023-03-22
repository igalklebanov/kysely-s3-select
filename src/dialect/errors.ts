export class S3SelectLocksUnsupportedError extends Error {
  constructor() {
    super('Locks are not supported!')
    this.name = 'S3SelectLocksUnsupportedError'
  }
}
