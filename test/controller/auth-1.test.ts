import { relative } from 'path';

import { Framework } from '@midwayjs/web';
import { createApp, close, createHttpRequest } from '@midwayjs/mock';

import { Application } from '../../src/interface';

const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  let app: Application;
  let currentUser;

  beforeAll(async () => {
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    await close(app);
  });


  it('should POST /auth/login by correct username and password', async () => {
    const response = await createHttpRequest(app)
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200);
    expect(response.body.data.token);
    currentUser = response.body.data;
  });

  it('should GET /auth/currentUser', async () => {
    const response = await createHttpRequest(app)
      .get('/auth/currentUser')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    expect(response.body.code).toBe(200);
  });

  it('should GET /auth/logout', async () => {
    const response = await createHttpRequest(app)
      .get('/auth/logout')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    expect(response.body.code).toBe(200);
  });

  it('should GET /auth/currentUser was logouted', async () => {
    const response = await createHttpRequest(app)
      .get('/auth/currentUser')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(401);
    expect(response.body.code).toBe(401);
  });
});
