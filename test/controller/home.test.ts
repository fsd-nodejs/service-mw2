import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';

describe('test/controller/home.test.ts', () => {
  let app;
  beforeAll(async () => {
    // create app
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    // close app
    await close(app);
  });

  it('should GET /', async () => {
    // make request
    const result = await createHttpRequest(app).get('/');
    // use expect by jest
    expect(result.status).toBe(401);
    // expect(result.text).toBe('Hello Midwayjs!');

    // or use assert
    // assert.deepStrictEqual(result.status, 200);
    // assert.deepStrictEqual(result.text, 'Hello Midwayjs!');
  });
});
