# kysely-surrealdb

![Powered by TypeScript](https://img.shields.io/badge/powered%20by-typescript-blue.svg)

[Kysely](https://github.com/koskimas/kysely) dialects, plugins and other goodies for [Amazon S3 Select](https://docs.aws.amazon.com/AmazonS3/latest/userguide/selecting-content-from-objects.html).

Inspired by [Thomas Aribart](https://github.com/ThomasAribart)'s great [post](https://dev.to/kumo/type-safe-s3-select-queries-with-kysely-4ge0).

## Installation

#### NPM 7+

```bash
npm i kysely-s3-select
```

#### NPM <7

```bash
npm i kysely-s3-select kysely @aws-sdk/client-s3
```

#### Yarn

```bash
yarn add kysely-s3-select kysely @aws-sdk/client-s3
```

#### PNPM

```bash
pnpm add kysely-s3-select kysely @aws-sdk/client-s3
```

### Deno

The package was not tested in Deno, aws-sdk-v3 could might not be supported.

This package uses/extends some [Kysely](https://github.com/koskimas/kysely) types and classes, which are imported using its NPM package name -- not a relative file path or CDN url.

To fix that, add an [`import_map.json`](https://deno.land/manual@v1.26.1/linking_to_external_code/import_maps) file.

```json
{
  "imports": {
    "kysely": "https://cdn.jsdelivr.net/npm/kysely@0.23.5/dist/esm/index.js"
  }
}
```

## Usage

```ts
import { S3Client } from '@aws-sdk/client-s3'
import { Kysely } from 'kysely'
import { S3SelectDialect } from 'kysely-s3-select'

interface ConditionsCSV {
  S3Object: Condition
}

interface Condition {
  START: string
  STOP: string
  PATIENT: string
  CODE: string
  DESCRIPTION: string
}

const conditions = new Kysely<ConditionsCSV>({
  dialect: new S3SelectDialect({
    bucket: 'synthea-open-data',
    client: new S3Client({
      region: 'us-east-1', // optional
    }),
    contentType: 'csv', // one of 'csv' | 'json' | 'parquet'
    // csvOptions: { // optional
    //   allowQuotedRecordDelimiter: false, // optional
    //   comments?: '#', // optional
    //   fieldDelimiter?: ',', // optional
    //   fileHeaderInfo?: 'use', // optional
    //   quoteCharacter?: '"', // optional
    //   quoteEscapeCharacter?: '"', // optional
    //   recordDelimiter?: '\n', // optional
    // },
    key: 'coherent/unzipped/csv/conditions.csv',
  })
})

const results = await conditions
  .selectFrom('S3Object')
  .where('START', '>=', '2000')
  .where('STOP', '!=', '')
  .select(['PATIENT as patient', 'DESCRIPTION as description'])
  .limit(50)
  .execute()
  
interface PatientBundleJSON {
  S3Object: Bundle
}

interface Bundle {
  resourceType: 'Bundle'
  type: 'transaction'
  entry: Entry[]
}

interface Entry {
  fullUrl: string
  resource: Patient
  request: object
}

interface Patient {
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
  
const patientBundle = new Kysely<PatientBundleJSON>({
  dialect: new S3SelectDialect({
    bucket: 'synthea-open-data',
    client: new S3Client({
      region: 'us-east-1', // optional
    }),
    contentType: 'json', // one of 'csv' | 'json' | 'parquet'
    // jsonOptions: { // optional
    //   allowQuotedRecordDelimiter: false, // optional
    // },
    key: 'coherent/unzipped/fhir/Abe604_Frami345_b8dd1798-beef-094d-1be4-f90ee0e6b7d5.json',
  })
})

const patient = await patientBundle
  .selectFrom(
    sql<Partial<Entry['resource']>>`S3Object[*].${sql.ref('entry')}[*].${sql.ref('resource')}`.as('resource'),
  )
  .where('resource.resourceType', '=', 'Patient')
  .select(['resource.id as id', 'resource.name as name'])
  .limit(1)
  .$castTo<Pick<Patient, 'id' | 'name'>>()
  .executeTakeFirstOrThrow()
```

#### Why not write a query builder from scratch

Kysely is growing to be THE sql query builder solution in the typescript ecosystem.
Koskimas' dedication, attention to detail, experience from creating objection.js, project structure, simplicity, design patterns and philosophy,
made adding code to that project a really good experience as a contributor. Taking
what's great about that codebase, and patching in SurrealQL stuff seems like an easy
win in the short-medium term.

## License

MIT License, see `LICENSE`
