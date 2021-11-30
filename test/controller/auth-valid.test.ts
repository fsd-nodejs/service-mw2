import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../root.config';


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should POST /auth/login by correct username and password', async () => {
    const { app, httpRequest } = testConfig

    const response = await httpRequest
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200);

    assert(response.body.data.token);
  });

  it('should GET /auth/currentUser', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/auth/currentUser')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);

    assert(response.body.code === 200);
  });

  it('should GET 404 with valid token', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/auth/currentUserNotFound')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(404);

    assert(response.body.code === 404);
  });

  it('should GET /auth/logout', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)
    const response = await httpRequest
      .get('/auth/logout')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);

    assert(response.body.code === 200);
  });

  it('should GET /auth/currentUser was logouted', async () => {
    const { httpRequest, currentUser } = testConfig

    assert(currentUser.token)

    await httpRequest
      .get('/auth/logout')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);

    const response = await httpRequest
      .get('/auth/currentUser')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(401);

    assert(response.body.code === 401);
  });

});
