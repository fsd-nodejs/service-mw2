import { relative } from 'path';

import { Framework } from '@midwayjs/web';
import { createApp, close, createHttpRequest } from '@midwayjs/mock';

import { Application } from '../../src/interface';

const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  let app: Application;
  // let currentUser;

  beforeAll(async () => {
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    await close(app);
  });

  it('should POST /auth/login by wrong username and password', async () => {
    const response = await createHttpRequest(app)
      .post('/auth/login')
      .type('form')
      .send({
        username: app.config.admin.username,
        password: '123456',
      })
      .expect(400);
    expect(response.body.code).toBe(400);
  });

  // it('should POST /auth/login by wrong username', async () => {
  //   const response = await createHttpRequest(app)
  //     .post('/auth/login')
  //     .type('form')
  //     .send({
  //       username: 'fakename',
  //       password: '123456',
  //     })
  //     .expect(400);
  //   expect(response.body.code).toBe(400);
  // });

  // it('should POST /auth/login by wrong input', async () => {
  //   const response = await createHttpRequest(app)
  //     .post('/auth/login')
  //     .type('form')
  //     .expect(422);
  //   expect(response.body.code).toBe(422);
  // });

  // it('should GET 404', async () => {
  //   const response = await createHttpRequest(app)
  //     .get('/auth/currentUsersss')
  //     .set('Authorization', `Bearer ${currentUser.token}`)
  //     .expect(404);
  //   expect(response.body.code).toBe(404);
  // });
});
