import * as assert from 'assert';

import {
  Controller,
  Get,
  Post,
  Provide,
  Inject,
  Validate,
  Body,
  ALL,
} from '@midwayjs/decorator';
import { CreateApiDoc } from '@midwayjs/swagger';
import { Context } from 'egg';

import { AuthService } from '../service/auth';
import { LoginDTO } from '../dto/auth';
import MyError from '../util/my-error';

@Provide()
@Controller('/auth', {
  tagName: '管理员登录授权',
  description: '包含管理员授权登录、获取信息等接口 ',
})
export class AuthController {
  @Inject('authService')
  service: AuthService;

  /**
   * 登录，目前使用帐号+密码模式
   */
  @(CreateApiDoc()
    .summary('管理员登录')
    .description(
      '使用帐号密码登录，拿到 token 后，前端需要将 token 放入 header 中，格式 token: Bearer ${token}'
    )
    .respond(200, 'success', 'json', {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9xxxx',
        currentAuthority: 'admin',
        status: 'ok',
        type: 'account',
      },
    })
    .build())
  @Post('/login')
  @Validate()
  async login(ctx: Context, @Body(ALL) params: LoginDTO): Promise<void> {
    // 后续可能有多种登录方式
    let existAdmiUser = await this.service.localHandler(params);

    // 判断管理员是否存在
    assert(
      existAdmiUser !== null,
      new MyError('这些凭据与我们的记录不符', 400)
    );

    // 生成Token
    const token = await this.service.createAdminUserToken(existAdmiUser);

    // 查询用户权限(用于中间件鉴权逻辑)
    const permissions = await this.service.getAdminUserGrantById(
      existAdmiUser.id
    );

    existAdmiUser = Object.assign(existAdmiUser, { permissions });
    // 缓存管理员数据
    await this.service.cacheAdminUser(existAdmiUser);

    // TODO: 调用 rotateCsrfSecret 刷新管理员的 CSRF token
    // ctx.rotateCsrfSecret()

    ctx.helper.success({
      token,
      currentAuthority: 'admin',
      status: 'ok',
      type: 'account',
    });
  }

  /**
   * 退出登录
   */
  @(CreateApiDoc()
    .summary('管理员退出登录')
    .description('退出登录，退出成功 data 为{}')
    .respond(200, 'success')
    .build())
  @Get('/logout')
  async logout(ctx: Context): Promise<void> {
    const { currentUser } = ctx;

    // 清理管理员数据和token
    await this.service.removeAdminUserTokenById(currentUser.id);
    await this.service.cleanAdminUserById(currentUser.id);

    ctx.helper.success({});
  }

  /**
   * 获取当前管理员的信息
   */
  @(CreateApiDoc()
    .summary('获取当前管理员的信息')
    .description('管理员相关的信息')
    .respond(200, 'success', 'json', {
      example: {
        id: '1',
        username: 'admin',
        name: 'Administrator',
        avatar: 'http://x.y.z',
        createdAt: '2020-08-20T01:14:57.000Z',
        updatedAt: '2020-08-20T01:14:57.000Z',
      },
    })
    .build())
  @Get('/currentUser')
  async currentUser(ctx: Context): Promise<void> {
    ctx.helper.success(ctx.currentUser);
  }
}
