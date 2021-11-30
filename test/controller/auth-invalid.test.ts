import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../root.config';


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {

  it('should POST /auth/login by wrong username and password', async () => {
    const { app, httpRequest } = testConfig

    const response = await httpRequest
      .post('/auth/login')
      .type('form')
      .send({
        username: app.config.admin.username,
        password: '123456',
      })
      .expect(400);

    assert(response.body.code === 400);
  });

  it('should POST /auth/login by wrong username', async () => {
    const { httpRequest } = testConfig

    const response = await httpRequest
      .post('/auth/login')
      .type('form')
      .send({
        username: 'fakename',
        password: '123456',
      })
      .expect(400);

    assert(response.body.code === 400);
  });

  it('should POST /auth/login by wrong input', async () => {
    const { httpRequest } = testConfig

    const response = await httpRequest
      .post('/auth/login')
      .type('form')
      .expect(422);

    assert(response.body.code === 422);
  });

});
