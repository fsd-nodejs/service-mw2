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
import { Context } from '@midwayjs/web';

import { AuthService } from '@/app/service/auth';
import { AuthDTO } from '@/app/dto/auth';
import MyError from '@/app/util/my-error';

@Provide()
@Controller('/auth')
export class AuthController {
  @Inject('authService')
  service: AuthService;

  /**
   * 登录，目前使用帐号+密码模式
   */
  @Post('/login')
  @Validate()
  public async login(ctx: Context, @Body(ALL) params: AuthDTO): Promise<void> {
    // 后续可能有多种登录方式
    const existAdmiUser = await this.service.localHandler(params);

    // 判断用户是否存在
    assert(
      existAdmiUser !== null,
      new MyError('这些凭据与我们的记录不符', 400)
    );

    // 生成Token
    const token = await this.service.createAdminUserToken(existAdmiUser);

    // 缓存用户数据
    await this.service.cacheAdminUser(existAdmiUser);

    // 调用 rotateCsrfSecret 刷新用户的 CSRF token
    // ctx.rotateCsrfSecret()

    ctx.helper.success(ctx, {
      token,
      currentAuthority: 'admin',
      status: 'ok',
      type: 'account',
    });
  }

  /**
   * 退出登录
   */
  @Get('/logout')
  public async logout(ctx: Context): Promise<void> {
    const { user } = ctx;

    // 清理用户数据和token
    await this.service.removeAdminUserTokenById(user.id);
    await this.service.cleanAdminUserById(user.id);

    ctx.helper.success(ctx, {});
  }

  /**
   * 获取当前用户的信息
   */
  @Get('/currentUser')
  public async currentUser(ctx: Context): Promise<void> {
    const { user } = ctx;

    const currentUser = await this.service.getAdminUserById(user.id);

    ctx.helper.success(ctx, currentUser);
  }
}
