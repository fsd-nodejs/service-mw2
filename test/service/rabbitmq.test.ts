import * as assert from 'power-assert';

import { Framework } from '@midwayjs/web';
import { createApp, close } from '@midwayjs/mock';

import { Application } from '../../src/interface';
import { RabbitmqService } from '../../src/app/service/rabbitmq';

describe('test/service/rabbitmq.test.ts', () => {
  let app: Application;

  beforeAll(async () => {
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    await close(app);
  });

  it('#sendToQueue >send message "hello world"', async () => {
    const rabbitmqService = await app.applicationContext.getAsync<RabbitmqService>(
      'rabbitmqService'
    );
    const res = await rabbitmqService.sendToQueue('my-queue', 'hello world');
    assert.ok(res);
  });
});
