import type {
  DatabaseIntrospector,
  DatabaseMetadata,
  DatabaseMetadataOptions,
  Kysely,
  SchemaMetadata,
  TableMetadata,
} from 'kysely'

export class S3SelectIntrospector implements DatabaseIntrospector {
  readonly #db: Kysely<any>

  constructor(db: Kysely<any>) {
    this.#db = db
  }

  getSchemas(): Promise<SchemaMetadata[]> {
    throw new Error('Method not implemented.')
  }

  getTables(options?: DatabaseMetadataOptions | undefined): Promise<TableMetadata[]> {
    throw new Error('Method not implemented.')
  }

  getMetadata(options?: DatabaseMetadataOptions | undefined): Promise<DatabaseMetadata> {
    throw new Error('Method not implemented.')
  }
}
