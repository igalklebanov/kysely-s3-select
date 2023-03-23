import {S3Client} from '@aws-sdk/client-s3'
import {Kysely} from 'kysely'

import {S3SelectDialect} from '../../src/dialect/dialect.js'

export interface Condition {
  START: string
  STOP: string
  PATIENT: string
  CODE: string
  DESCRIPTION: string
}

export interface CSVDatabase {
  S3Object: Condition
}

export interface Bundle {
  resourceType: 'Bundle'
  type: 'transaction'
  entry: Entry[]
}

export interface Entry {
  fullUrl: string
  resource: Patient
  request: object
}

export interface Patient {
  resourceType: 'Patient'
  id: string
  meta: object
  text: object
  extension: object[]
  identifier: object[]
  name: {
    use: 'official'
    family: string
    given: string[]
    prefix: string[]
  }[]
  telecom: object[]
  gender: 'male' | 'female'
  birthDate: string
  deceasedDateTime: string
  address: object[]
  maritalStatus: object
  multipleBirthBoolean: boolean
  communication: object[]
}

export interface JSONDatabase {
  S3Object: Bundle
}

export type TestContext = Awaited<ReturnType<typeof initTest>>

const client = new S3Client({
  region: 'us-east-1',
})
const BUCKET = 'synthea-open-data'
const KEY_CSV = 'coherent/unzipped/csv/conditions.csv'
const KEY_JSON = 'coherent/unzipped/fhir/Abe604_Frami345_b8dd1798-beef-094d-1be4-f90ee0e6b7d5.json'

export async function initTest() {
  return {
    csv: new Kysely<CSVDatabase>({
      dialect: new S3SelectDialect({
        bucket: BUCKET,
        client,
        contentType: 'csv',
        key: KEY_CSV,
      }),
    }),
    json: new Kysely<JSONDatabase>({
      dialect: new S3SelectDialect({
        bucket: BUCKET,
        client,
        contentType: 'json',
        key: KEY_JSON,
      }),
    }),
  }
}
