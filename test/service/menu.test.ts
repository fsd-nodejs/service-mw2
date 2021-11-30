import { relative } from 'path';
import assert from 'assert';

import { testConfig } from '../root.config';
import { AdminMenuService } from '../../src/app/service/admin/menu';


const filename = relative(process.cwd(), __filename).replace(/\\/ug, '/')

describe(filename, () => {
  let currentMenu: any;

  it('#queryAdminMenu >should get menu list total > 0', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext()

    const menuService = await ctx.requestContext.getAsync(AdminMenuService);
    const queryParams = {
      pageSize: 10,
      current: 1,
    };
    const { total } = await menuService.queryAdminMenu(queryParams);
    assert.ok(total);
  });

  it('#createAdminMenu >should created menu', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext()

    const menuService = await ctx.requestContext.getAsync(AdminMenuService);
    const params = {
      parentId: '0',
      title: 'fakeTitle',
      uri: 'fakeUri',
      roles: ['1'],
      permissionId: '1',
    };
    const menu = await menuService.createAdminMenu(params);

    assert.ok(menu);
    currentMenu = menu;
  });

  it('#getAdminMenuById >should get menu by id', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext()

    const menuService = await ctx.requestContext.getAsync(AdminMenuService);
    const menu = await menuService.getAdminMenuById(currentMenu.id);

    assert.ok(menu);
  });

  it('#updateAdminMenu >should update menu', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext()

    const menuService = await ctx.requestContext.getAsync(AdminMenuService);
    const { id } = currentMenu;
    const { affected } = await menuService.updateAdminMenu({
      id,
      parentId: '0',
      title: 'fakeTitle2',
      uri: 'fakeUri2',
      roles: [],
      permissionId: '2',
    });
    assert.ok(affected);
  });

  it('#removeAdminMenuByIds >should remove menu', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext()

    const menuService = await ctx.requestContext.getAsync(AdminMenuService);
    const { id } = currentMenu;
    const total = await menuService.removeAdminMenuByIds([id]);
    assert.ok(total);
  });

  it('#orderAdminMemu >should order menu', async () => {
    const { app } = testConfig
    const ctx = app.createAnonymousContext()

    const menuService = await ctx.requestContext.getAsync(AdminMenuService);
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

    assert.ok(newMenu)
    assert.deepEqual(newMenu.order, newList[0].order);

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
