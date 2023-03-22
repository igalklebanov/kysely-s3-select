import type {DatabaseIntrospector, Dialect, DialectAdapter, Driver, Kysely, QueryCompiler} from 'kysely'

import {S3SelectAdapter} from './adapter.js'
import {S3SelectDriver} from './driver.js'
import {S3SelectIntrospector} from './introspector.js'
import {S3SelectQueryCompiler} from './query-compiler.js'
import type {S3SelectDialectConfig} from './types.js'

export class S3SelectDialect implements Dialect {
  readonly #config: S3SelectDialectConfig

  constructor(config: S3SelectDialectConfig) {
    this.#config = config
  }

  createAdapter(): DialectAdapter {
    return new S3SelectAdapter()
  }

  createDriver(): Driver {
    return new S3SelectDriver(this.#config)
  }

  createIntrospector(db: Kysely<any>): DatabaseIntrospector {
    return new S3SelectIntrospector(db)
  }

  createQueryCompiler(): QueryCompiler {
    return new S3SelectQueryCompiler()
  }
}
