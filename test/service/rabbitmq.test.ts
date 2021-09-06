import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../root.config';
import { RabbitmqService } from '../../src/app/service/rabbitmq';


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  it('#sendToQueue >send message "hello world"', async () => {
    const { container } = testConfig

    const rabbitmqService = await container.getAsync(RabbitmqService);
    const res = await rabbitmqService.sendToQueue('my-queue', 'hello world');
    assert.ok(res);
  });
});
