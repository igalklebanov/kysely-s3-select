import {expect} from 'chai'

import {down, up, type TestContext} from './setup'

describe('select', () => {
  let ctx: TestContext

  before(async () => {
    ctx = await up()
  })

  after(async () => {
    await down()
  })

  it('should work!', async () => {
    const query = ctx.db.selectFrom('S3Object').where('id', '>', 0).selectAll()

    expect(query.compile().sql).to.equal('select * from "S3Object" where "id" > 0')

    const results = await query.execute()

    console.log('results', results)
  })
})
