import { Provide, Plugin } from '@midwayjs/decorator';
import { IUserOptions } from '@/interface';
import { Redis } from 'ioredis';

@Provide()
export class UserService {
  @Plugin()
  redis: Redis;

  async getUser(options: IUserOptions) {
    console.log(this.redis);
    // const token = await this.redis.get('admin:accessToken:1');
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
      // token: token,
    };
  }
}
