import type {S3Client} from '@aws-sdk/client-s3'

export type S3SelectDialectConfig = {
  bucket: string
  client: S3Client
  compressionType?: 'none' | 'gzip' | 'bzip2'
  key: string
} & (
  | {
      contentType: 'csv'
      csvOptions?: CSVOptions
    }
  | {
      contentType: 'json'
      jsonOptions?: JSONOptions
    }
  | {
      contentType: 'parquet'
    }
)

/**
 * {@link https://docs.aws.amazon.com/AmazonS3/latest/API/API_CSVInput.html}
 */
export interface CSVOptions {
  allowQuotedRecordDelimiter?: boolean
  comments?: string
  fieldDelimiter?: string
  fileHeaderInfo?: 'none' | 'ignore' | 'use'
  quoteCharacter?: string
  quoteEscapeCharacter?: string
  recordDelimiter?: string
}

/**
 * {@link https://docs.aws.amazon.com/AmazonS3/latest/API/API_JSONInput.html}
 */
export interface JSONOptions {
  type?: 'document' | 'lines'
}

/**
 * {@link https://docs.aws.amazon.com/AmazonS3/latest/API/API_ParquetInput.html}
 */
export interface ParquetOptions {}
