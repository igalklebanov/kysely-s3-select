export class S3SelectLocksUnsupportedError extends Error {
  constructor() {
    super('S3 select does not support locks!')
    this.name = 'S3SelectLocksUnsupportedError'
  }
}

export class S3SelectTransactionsUnsupportedError extends Error {
  constructor() {
    super('S3 select does not support transactions!')
    this.name = 'S3SelectTransactionsUnsupportedError'
  }
}

export class S3SelectStreamingUnsupportedError extends Error {
  constructor() {
    super('S3 select does not support streaming!')
    this.name = 'S3SelectStreamingUnsupportedError'
  }
}

export class S3SelectContentTypeUnsupportedError extends Error {
  constructor(contentType: string) {
    super(`S3 select does not support content type ${contentType}!`)
    this.name = 'S3SelectContentTypeUnsupportedError'
  }
}
