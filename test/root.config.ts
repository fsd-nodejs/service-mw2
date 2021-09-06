import { join } from 'path';

import { IMidwayKoaNext } from '@midwayjs/koa'
import { JwtComponent } from '@mw-components/jwt'
import supertest, { SuperTest } from 'supertest'

import {
  Application,
  IMidwayContainer,
} from '../src/interface'


export interface TestConfig {
  /** host of test process */
  host: string
  app: Application
  container: IMidwayContainer
  httpRequest: SuperTest<supertest.Test>
  jwt: JwtComponent
  next: IMidwayKoaNext
  logsDir: string
  currentUser?: {
    token: string
  }
}
const next: IMidwayKoaNext = async () => { return }
export const testConfig = {
  next,
  logsDir: join(__dirname, 'logs'),
} as TestConfig

