import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import {Kysely} from 'kysely'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'

import {S3SelectDialect} from '../../src/dialect/dialect.js'

export interface PokemonRow {
  id: number
  name: string
  customName: string
  type: string
  level: number
  generation: number
}

export interface Database {
  S3Object: PokemonRow
}

export interface TestContext {
  db: Kysely<Database>
}

const client = new S3Client({
  endpoint: 'http://127.0.0.1:4566',
})
const BUCKET_NAME = 'test-bucket'
const FILE_NAME = 'pokemons.csv'

export async function up(): Promise<TestContext> {
  await createBucket()
  await uploadFiles()

  return {
    db: new Kysely<Database>({
      dialect: new S3SelectDialect({
        bucket: BUCKET_NAME,
        client,
        compressionType: 'none',
        contentType: 'csv',
        csvOptions: {
          fieldDelimiter: ',',
          fileHeaderInfo: 'use',
          quoteCharacter: '"',
          recordDelimiter: '\n',
        },
        key: FILE_NAME,
      }),
    }),
  }
}

export async function down(): Promise<void> {
  await deleteFiles()
  await deleteBucket()
}

async function createBucket(): Promise<void> {
  await client.send(new CreateBucketCommand({Bucket: BUCKET_NAME}))
}

async function deleteBucket(): Promise<void> {
  await client.send(new DeleteBucketCommand({Bucket: BUCKET_NAME}))
}

async function deleteFiles(): Promise<void> {
  await client.send(new DeleteObjectCommand({Bucket: BUCKET_NAME, Key: FILE_NAME}))
}

async function uploadFiles(): Promise<void> {
  await client.send(
    new PutObjectCommand({
      Body: readFileSync(join(__dirname, 'pokemons.csv')),
      Bucket: BUCKET_NAME,
      ContentType: 'text/csv',
      Key: FILE_NAME,
    }),
  )
}
