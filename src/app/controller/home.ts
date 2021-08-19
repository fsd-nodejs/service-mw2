import { Controller, Get, Inject, Provide } from '@midwayjs/decorator';
import { CreateApiDoc } from '@midwayjs/swagger';
import { JwtComponent } from '@mw-components/jwt';
import { Context } from 'egg';
import { KoidComponent } from '@mw-components/koid';

import { RabbitmqService } from '../service/rabbitmq';

@Provide()
@Controller('/', {
  tagName: '默认的接口',
  description: '包含连通性接口、鉴权验证接口',
})
export class HomeController {
  @Inject('jwt:jwtComponent')
  jwt: JwtComponent;

  @Inject()
  readonly koid: KoidComponent;

  @Inject()
  rabbitmqService: RabbitmqService;

  @(CreateApiDoc().summary('获取主页').description('需要鉴权').build())
  @Get('/')
  async home(ctx: Context) {
    ctx.tracerManager.startSpan('getHome');
    const ret = 'Hello Midwayjs!' + `\nreqId: "${ctx.reqId}"`;
    ctx.tracerManager.finishSpan();
    return ret;
  }

  @(CreateApiDoc().summary('检查连通性').description('不需要鉴权').build())
  @Get('/ping')
  async ping(ctx: Context) {
    ctx.body = 'OK';
  }

  @(CreateApiDoc()
    .summary('生成雪花ID，输出bigint')
    .description('不需要鉴权')
    .build())
  @Get('/genid')
  genId(): string {
    return this.koid.idGenerator.toString();
  }

  @(CreateApiDoc()
    .summary('生成雪花ID，输出HEX')
    .description('不需要鉴权')
    .build())
  @Get('/genidHex')
  genIdHex(): string {
    return this.koid.nextHex;
  }

  @Get('/sendToQueue')
  async sendToQueue(ctx: Context) {
    const res = await this.rabbitmqService.sendToQueue(
      'my-queue',
      'hello world'
    );
    ctx.helper.success(res);
  }
}
