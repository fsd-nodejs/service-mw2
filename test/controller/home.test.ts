import { relative } from 'path';
import assert from 'assert';
import { KoidComponent } from '@mw-components/koid';

import { testConfig } from '../root.config'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should GET /', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);

    const msg: string = response.text;
    assert.ok(msg && msg.includes('Hello Midwayjs!'));
    assert.ok(/reqId: "[1-9]\d{9,18}"/u.test(msg), msg); // 6755455236955799552
  });

  it('should GET /ping', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const ret = await httpRequest.get('/ping').expect(200);

    const msg: string = ret.text;
    assert.ok(msg && msg.includes('OK'));
  });

  it('should GET /genid', async () => {
    const { app, httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest.get('/genid').expect(200);

    const msg: string = response.text;
    assert.ok(/[1-9]\d{9,18}/u.test(msg)); // 6755455236955799552

    const ctx = app.createAnonymousContext();
    const koid = await ctx.requestContext.getAsync(KoidComponent);

    const info = koid.retrieveFromId(msg);
    assert.ok(info.dataCenter === koid.config.dataCenter);
    assert.ok(info.worker === koid.config.worker);
  });

  it('should GET /genidHex', async () => {
    const { app, httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest.get('/genidHex').expect(200);

    const msg: string = response.text;
    assert.ok(/[\dxa-f]{16}/u.test(msg), msg); // 5dc032befecd8000, 02a5f26eb5197000

    const ctx = app.createAnonymousContext();
    const koid = await ctx.requestContext.getAsync(KoidComponent);

    const info = koid.retrieveFromId(msg);
    assert.ok(info.dataCenter === koid.config.dataCenter);
    assert.ok(info.worker === koid.config.worker);
  });

  it('should GET /sendToQueue', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/sendToQueue')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert.ok(response.body.data);
  });
});
