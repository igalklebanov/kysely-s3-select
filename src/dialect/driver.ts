import {DatabaseConnection, Driver, TransactionSettings} from 'kysely'

import type {S3SelectDialectConfig} from './types.js'

export class S3SelectDriver implements Driver {
  readonly #config: S3SelectDialectConfig

  constructor(config: S3SelectDialectConfig) {
    this.#config = config
  }

  init(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  acquireConnection(): Promise<DatabaseConnection> {
    throw new Error('Method not implemented.')
  }

  beginTransaction(connection: DatabaseConnection, settings: TransactionSettings): Promise<void> {
    throw new Error('Method not implemented.')
  }

  commitTransaction(connection: DatabaseConnection): Promise<void> {
    throw new Error('Method not implemented.')
  }

  rollbackTransaction(connection: DatabaseConnection): Promise<void> {
    throw new Error('Method not implemented.')
  }

  releaseConnection(connection: DatabaseConnection): Promise<void> {
    throw new Error('Method not implemented.')
  }

  destroy(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
