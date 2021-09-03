import { relative } from 'path';

import { testConfig } from '../root.config'


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  let currentUser;

  it('should POST /auth/login by correct username and password', async () => {
    const { app, httpRequest } = testConfig

    const response = await httpRequest
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200);
    expect(response.body.data.token);
    currentUser = response.body.data;
  });

  it('should GET /auth/currentUser', async () => {
    const { httpRequest } = testConfig

    const response = await httpRequest
      .get('/auth/currentUser')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    expect(response.body.code).toBe(200);
  });

  it('should GET /auth/logout', async () => {
    const { httpRequest } = testConfig

    const response = await httpRequest
      .get('/auth/logout')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    expect(response.body.code).toBe(200);
  });

  it('should GET /auth/currentUser was logouted', async () => {
    const { httpRequest } = testConfig

    const response = await httpRequest
      .get('/auth/currentUser')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(401);
    expect(response.body.code).toBe(401);
  });
});
