import {SelectObjectContentCommand, type InputSerialization} from '@aws-sdk/client-s3'
import type {CompiledQuery, DatabaseConnection, QueryResult} from 'kysely'

import {S3SelectContentTypeUnsupportedError, S3SelectStreamingUnsupportedError} from './errors.js'
import type {S3SelectDialectConfig} from './types.js'

export class S3SelectConnection implements DatabaseConnection {
  readonly #config: S3SelectDialectConfig

  constructor(config: S3SelectDialectConfig) {
    this.#config = config
  }

  async executeQuery<R>(compiledQuery: CompiledQuery): Promise<QueryResult<R>> {
    const command = new SelectObjectContentCommand({
      Bucket: this.#config.bucket,
      Expression: compiledQuery.sql,
      ExpressionType: 'SQL',
      InputSerialization: this.#resolveInputSerialization(),
      Key: this.#config.key,
      OutputSerialization: {
        JSON: {
          RecordDelimiter: ',',
        },
      },
    })

    const {Payload} = await this.#config.client.send(command)

    if (!Payload) {
      return {rows: []}
    }

    const textDecoder = new TextDecoder()
    const stringifiedOutputs: string[] = []

    for await (const {Records} of Payload) {
      if (Records) {
        stringifiedOutputs.push(textDecoder.decode(Records.Payload))
      }
    }

    return {
      rows: JSON.parse(`[${stringifiedOutputs.join('').slice(0, -1)}]`),
    }
  }

  streamQuery<R>(_: CompiledQuery<unknown>): AsyncIterableIterator<QueryResult<R>> {
    throw new S3SelectStreamingUnsupportedError()
  }

  #resolveInputSerialization(): InputSerialization {
    const inputSerialization = {CompressionType: this.#config.compressionType?.toUpperCase() || 'NONE'}

    const {contentType} = this.#config

    switch (contentType) {
      case 'csv':
        return {
          ...inputSerialization,
          CSV: {
            AllowQuotedRecordDelimiter: Boolean(this.#config.csvOptions?.allowQuotedRecordDelimiter),
            Comments: this.#config.csvOptions?.comments || '#',
            FieldDelimiter: this.#config.csvOptions?.fieldDelimiter || ',',
            FileHeaderInfo: this.#config.csvOptions?.fileHeaderInfo?.toUpperCase() || 'USE',
            QuoteCharacter: this.#config.csvOptions?.quoteCharacter || '"',
            QuoteEscapeCharacter: this.#config.csvOptions?.quoteEscapeCharacter || '"',
            RecordDelimiter: this.#config.csvOptions?.recordDelimiter,
          },
        }
      case 'json':
        return {
          ...inputSerialization,
          JSON: {
            Type: this.#config.jsonOptions?.type?.toUpperCase() || 'DOCUMENT',
          },
        }
      case 'parquet':
        return {
          ...inputSerialization,
          Parquet: {},
        }
      default:
        throw new S3SelectContentTypeUnsupportedError(contentType)
    }
  }
}
