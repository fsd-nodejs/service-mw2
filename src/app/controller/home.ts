import { Controller, Get, Provide, Plugin } from '@midwayjs/decorator';
import { Jwt } from '@waiting/egg-jwt';
import { Context } from '@midwayjs/web';

@Provide()
@Controller('/')
export class HomeController {
  @Plugin()
  jwt: Jwt;

  @Get('/')
  async home() {
    return 'Hello Midwayjs!';
  }

  @Get('/ping')
  async ping(ctx: Context) {
    ctx.body = 'OK';
  }
}
