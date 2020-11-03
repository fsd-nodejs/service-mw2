import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
// import * as assert from 'assert';

describe('test/controller/home.test.ts', () => {
  let app;
  beforeAll(async () => {
    // create app
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    close(app);
  });

  it('should GET /', async () => {
    // create app
    const app = await createApp<Framework>();

    // make request
    const result = await createHttpRequest(app).get('/');

    // use expect by jest
    expect(result.status).toBe(401);
    // expect(result.text).toBe('Hello Midwayjs!');

    // or use assert
    // assert.deepStrictEqual(result.status, 200);
    // assert.deepStrictEqual(result.text, 'Hello Midwayjs!');

    // close app
    await close(app);
  });
});
