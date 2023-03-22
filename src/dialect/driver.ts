import type {DatabaseConnection, Driver} from 'kysely'

import {S3SelectConnection} from './connection.js'
import {S3SelectTransactionsUnsupportedError} from './errors.js'
import type {S3SelectDialectConfig} from './types.js'

export class S3SelectDriver implements Driver {
  readonly #config: S3SelectDialectConfig

  constructor(config: S3SelectDialectConfig) {
    this.#config = config
  }

  async init(): Promise<void> {
    // noop
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    return new S3SelectConnection(this.#config)
  }

  beginTransaction(_: DatabaseConnection): Promise<void> {
    this.#throwTransactionsError()
  }

  commitTransaction(_: DatabaseConnection): Promise<void> {
    this.#throwTransactionsError()
  }

  rollbackTransaction(_: DatabaseConnection): Promise<void> {
    this.#throwTransactionsError()
  }

  async releaseConnection(_: DatabaseConnection): Promise<void> {
    // noop
  }

  async destroy(): Promise<void> {
    // noop
  }

  #throwTransactionsError(): never {
    throw new S3SelectTransactionsUnsupportedError()
  }
}
