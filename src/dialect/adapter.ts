import {DialectAdapterBase, type Kysely} from 'kysely'

import {S3SelectLocksUnsupportedError} from './errors.js'

export class S3SelectAdapter extends DialectAdapterBase {
  get supportsReturning(): boolean {
    return false
  }

  get supportsTransactionalDdl(): boolean {
    return false
  }

  async acquireMigrationLock(_: Kysely<any>): Promise<void> {
    this.#throwLocksError()
  }

  async releaseMigrationLock(_: Kysely<any>): Promise<void> {
    this.#throwLocksError()
  }

  #throwLocksError(): never {
    throw new S3SelectLocksUnsupportedError()
  }
}
