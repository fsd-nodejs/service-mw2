/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import 'tsconfig-paths/register'

import { createApp, close, createHttpRequest } from '@midwayjs/mock'
import { Framework } from '@midwayjs/web'
import { JwtComponent } from '@mw-components/jwt'

import { testConfig } from './root.config'


/**
 * @see https://mochajs.org/#root-hook-plugins
 * beforeAll:
 *  - In serial mode(Mocha’s default ), before all tests begin, once only
 *  - In parallel mode, run before all tests begin, for each file
 * beforeEach:
 *  - In both modes, run before each test
 */
export const mochaHooks = async () => {
  // avoid run multi times
  if (! process.env.mochaRootHookFlag) {
    process.env.mochaRootHookFlag = 'true'
  }

  return {
    beforeAll: async () => {
      const app = await createApp<Framework>()
      const container = app.getApplicationContext()
      testConfig.app = app
      testConfig.container = container
      testConfig.httpRequest = createHttpRequest(app)
      testConfig.jwt = await testConfig.container.getAsync(JwtComponent)

      const { url } = testConfig.httpRequest.get('/')
      testConfig.host = url
    },

    beforeEach: async () => {
    },

    afterEach: async () => {
    },

    afterAll: async () => {
      if (testConfig.app) {
        await close(testConfig.app)
      }
    },
  }

}

