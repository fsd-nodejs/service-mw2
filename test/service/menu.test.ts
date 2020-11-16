import * as assert from 'power-assert';

import { Framework } from '@midwayjs/web';
import { createApp, close } from '@midwayjs/mock';
import { Application } from 'egg';
import { AdminMenuService } from '../../src/app/service/admin/menu';

describe('test/service/menu.test.ts', () => {
  let app: Application;
  let currentMenu: any;

  beforeAll(async () => {
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    await close(app);
  });

  it('#queryAdminMenu >should get menu list total > 0', async () => {
    const menuService = await app.applicationContext.getAsync<AdminMenuService>(
      'adminMenuService'
    );
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { total } = await menuService.queryAdminMenu(queryParams);
    assert(total);
  });

  it('#createAdminMenu >should created menu', async () => {
    const ctx = app.mockContext();
    const menuService = await ctx.requestContext.getAsync<AdminMenuService>(
      'adminMenuService'
    );
    const params = {
      parentId: '0',
      title: 'fakeTitle',
      uri: 'fakeUri',
      roles: ['1'],
      permissionId: '1',
    };
    const menu = await menuService.createAdminMenu(params);

    assert(menu);
    currentMenu = menu;
  });

  it('#getAdminMenuById >should get menu by id', async () => {
    const menuService = await app.applicationContext.getAsync<AdminMenuService>(
      'adminMenuService'
    );
    const menu = await menuService.getAdminMenuById(currentMenu.id);

    assert(menu);
  });

  it('#updateAdminMenu >should update menu', async () => {
    const ctx = app.mockContext();
    const menuService = await ctx.requestContext.getAsync<AdminMenuService>(
      'adminMenuService'
    );
    const { id } = currentMenu;
    const { affected } = await menuService.updateAdminMenu({
      id,
      parentId: '0',
      title: 'fakeTitle2',
      uri: 'fakeUri2',
      roles: [],
      permissionId: '2',
    });
    assert(affected);
  });

  it('#removeAdminMenuByIds >should remove menu', async () => {
    const menuService = await app.applicationContext.getAsync<AdminMenuService>(
      'adminMenuService'
    );
    const { id } = currentMenu;
    const total = await menuService.removeAdminMenuByIds([id]);
    assert(total);
  });

  it('#orderAdminMemu >should order menu', async () => {
    const menuService = await app.applicationContext.getAsync<AdminMenuService>(
      'adminMenuService'
    );
    const queryParams = {
      pageSize: 1000,
      current: 1,
    };
    const { list } = await menuService.queryAdminMenu(queryParams);

    const newList = list.map((item, index) => {
      return {
        id: item.id,
        parentId: item.parentId,
        order: list.length - index,
      };
    });

    await menuService.orderAdminMenu(newList);

    const newMenu = await menuService.getAdminMenuById(list[0].id);

    assert.deepEqual(newMenu?.order, newList[0].order);

    const sortList = list.map((item, index) => {
      return {
        id: item.id,
        parentId: item.parentId,
        order: index + 1,
      };
    });
    await menuService.orderAdminMenu(sortList);
  });
});
