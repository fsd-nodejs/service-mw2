import * as assert from 'power-assert';

import { Framework } from '@midwayjs/web';
import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Application } from 'egg';
import { KoidComponent } from 'midway-component-koid';

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
    assert.ok(/reqId: "[1-9]\d{9,18}"/u.test(msg), msg); // 6755455236955799552
  });

  it('should GET /ping', async () => {
    const ret = await createHttpRequest(app).get('/ping').expect(200);

    const msg: string = ret.text;
    assert.ok(msg && msg === 'OK');
  });

  it('should GET /genid', async () => {
    const response = await createHttpRequest(app).get('/genid').expect(200);

    const msg: string = response.text;
    assert.ok(/[1-9]\d{9,18}/u.test(msg)); // 6755455236955799552

    const ctx = app.createAnonymousContext();
    const koid = await ctx.requestContext.getAsync(KoidComponent);

    const info = koid.retrieveFromId(msg);
    assert.ok(info.dataCenter === koid.config.dataCenter);
    assert.ok(info.worker === koid.config.worker);
  });

  it('should GET /genidHex', async () => {
    const response = await createHttpRequest(app).get('/genidHex').expect(200);

    const msg: string = response.text;
    assert.ok(/[\dxa-f]{16}/u.test(msg), msg); // 5dc032befecd8000, 02a5f26eb5197000

    const ctx = app.createAnonymousContext();
    const koid = await ctx.requestContext.getAsync(KoidComponent);

    const info = koid.retrieveFromId(msg);
    assert.ok(info.dataCenter === koid.config.dataCenter);
    assert.ok(info.worker === koid.config.worker);
  });

  it('should GET /sendToQueue', async () => {
    const response = await createHttpRequest(app)
      .get('/sendToQueue')
      .expect(200);
    assert.ok(response.body.data);
  });
});
