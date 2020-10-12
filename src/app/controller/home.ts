import { Controller, Get, Provide, Plugin } from '@midwayjs/decorator';
import { Jwt } from '@waiting/egg-jwt';

@Provide()
@Controller('/')
export class HomeController {
  @Plugin()
  jwt: Jwt;

  @Get('/')
  async home() {
    return 'Hello Midwayjs!';
  }

  @Get('/login')
  async login() {
    return 'Hello Midwayjs!22222';
  }
}
