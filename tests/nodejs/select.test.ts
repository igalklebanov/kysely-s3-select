import {expect} from 'chai'

import {sql} from 'kysely'
import {Entry, initTest, type Patient, type TestContext} from './setup'

describe('select', () => {
  let ctx: TestContext

  before(async () => {
    ctx = await initTest()
  })

  describe('csv', () => {
    it('should select some columns, filter and limit', async () => {
      const query = ctx.csv
        .selectFrom('S3Object')
        .where('START', '>=', '2000')
        .where('STOP', '!=', '')
        .select(['PATIENT as patient', 'DESCRIPTION as description'])
        .limit(50)

      expect(query.compile().sql).to.equal(
        [
          'select "PATIENT" as "patient",',
          '"DESCRIPTION" as "description"',
          'from "S3Object"',
          'where "START" >= \'2000\'',
          'and "STOP" != \'\'',
          'limit 50',
        ].join(' '),
      )

      const results = await query.execute()

      expect(results).to.be.an('array').that.is.not.empty
      results.forEach((result) => {
        expect(result).to.be.an('object')
        expect(result).to.have.property('patient').which.is.a('string').that.is.not.empty
        expect(result).to.have.property('description').which.is.a('string').that.is.not.empty
      })
    })
  })

  describe('json', () => {
    it('should select some columns, filter and limit', async () => {
      const query = ctx.json
        .selectFrom(
          sql<Partial<Entry['resource']>>`S3Object[*].${sql.ref('entry')}[*].${sql.ref('resource')}`.as('resource'),
        )
        .where('resource.resourceType', '=', 'Patient')
        .select(['resource.id as id', 'resource.name as name'])
        .limit(1)
        .$castTo<Pick<Patient, 'id' | 'name'>>()

      expect(query.compile().sql).to.equal(
        [
          'select "resource"."id" as "id",',
          '"resource"."name" as "name"',
          'from S3Object[*]."entry"[*]."resource" as "resource"',
          'where "resource"."resourceType" = \'Patient\'',
          'limit 1',
        ].join(' '),
      )

      const patient = await query.executeTakeFirstOrThrow()

      expect(patient).to.be.an('object')
      expect(patient).to.have.property('id').which.is.a('string').that.is.not.empty
      expect(patient).to.have.property('name').which.is.an('array').that.is.not.empty
      patient.name.forEach((name) => {
        expect(name).to.be.an('object')
        expect(name).to.have.property('use').which.is.a('string').that.is.not.empty
        expect(name).to.have.property('family').which.is.a('string').that.is.not.empty
        expect(name).to.have.property('given').which.is.an('array').that.is.not.empty
        name.given.forEach((given) => expect(given).to.be.a('string').that.is.not.empty)
        expect(name).to.have.property('prefix').which.is.an('array').that.is.not.empty
        name.prefix.forEach((prefix) => expect(prefix).to.be.a('string').that.is.not.empty)
      })
    })
  })
})
