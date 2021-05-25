import * as assert from 'power-assert';

import { Framework } from '@midwayjs/web';
import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Application } from 'egg';
import { KoidEggConfig, retrieveFromId } from 'egg-koid'

describe('test/controller/home.test.ts', () => {
  let app: Application;
  let currentUser: any;
  beforeAll(async () => {
    app = await createApp<Framework>();
    const response = await createHttpRequest(app)
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200);
    currentUser = response.body.data;
  });

  afterAll(async () => {
    await close(app);
  });

  it('should GET /', async () => {
    const response = await createHttpRequest(app)
      .get('/')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);

    const msg: string = response.text;
    assert.ok(msg && msg.includes('Hello Midwayjs!'));
    assert.ok(/reqId: "[1-9]\d{18}"/u.test(msg), msg); // 6755455236955799552
  });

  it('should GET /ping', async () => {
    const ret = await createHttpRequest(app).get('/ping').expect(200);

    const msg: string = ret.text;
    assert.ok(msg && msg === 'OK');
  });

  it('should GET /genid', async () => {
    const response = await createHttpRequest(app)
      .get('/genid')
      .expect(200);

    const msg: string = response.text;
    assert.ok(/[1-9]\d{18}/u.test(msg)); // 6755455236955799552

    const config: KoidEggConfig = app.config.koid
    const info = retrieveFromId(msg)
    assert.ok(info.dataCenter === config.client.koidConfig.dataCenter)
    assert.ok(info.worker === config.client.koidConfig.worker)
  });

  it('should GET /genidHex', async () => {
    const response = await createHttpRequest(app)
      .get('/genidHex')
      .expect(200);

    const msg: string = response.text;
    assert.ok(/[\da-f]{16}/u.test(msg), msg); // 5dc032befecd8000

    const config: KoidEggConfig = app.config.koid
    const info = retrieveFromId(msg)
    assert.ok(info.dataCenter === config.client.koidConfig.dataCenter)
    assert.ok(info.worker === config.client.koidConfig.worker)
  });

});
