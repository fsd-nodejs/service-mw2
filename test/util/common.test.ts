import * as assert from 'assert'
import { basename } from '@waiting/shared-core'

import { retrieveExternalNetWorkInfo } from '../../src/app/util/common'


const filename = basename(__filename)

describe(filename, () => {
  it('Should retrieveExternalNetWorkInfo works', async () => {
    const infoList = retrieveExternalNetWorkInfo()
    assert(infoList.length > 0)
  })
})

