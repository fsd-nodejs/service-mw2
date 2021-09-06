import { relative } from 'path';
import assert from 'assert';

import { retrieveExternalNetWorkInfo } from '../../src/app/util/common'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  it('Should retrieveExternalNetWorkInfo works', async () => {
    const infoList = retrieveExternalNetWorkInfo()
    assert.ok(infoList.length > 0)
  })
})

