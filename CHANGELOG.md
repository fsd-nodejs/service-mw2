# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.1.0 (2021-06-08)


### Features

* **apm:** change ReturnType of processPriority() to number | undefined ([d785614](https://github.com/fsd-nodejs/service-mw2/commit/d785614a77faae83fb117c1909cafa3847037788))
* **apm:** define const TraceHeaderKey ([dad082e](https://github.com/fsd-nodejs/service-mw2/commit/dad082e3ad2c2bdfde571dc4ea4567a8db60beeb))
* **apm:** sample with more information ([81d93ce](https://github.com/fsd-nodejs/service-mw2/commit/81d93ce747faefeab109fbdc5af3341c5af586a1))
* **apm:** update default sample configuration ([74e5b7f](https://github.com/fsd-nodejs/service-mw2/commit/74e5b7f1565904a1e6897240851c7b254f4638b3))
* **apm:** update property TracerManager ([aab487b](https://github.com/fsd-nodejs/service-mw2/commit/aab487bc73cdc0dde124144cabac332ef486f919))
* **apm:** update TracerConfig['whiteList'] accepting RegExp ([3b1a635](https://github.com/fsd-nodejs/service-mw2/commit/3b1a6350f2b173014c26fb54d0687ad99e4e7ca1))
* **apm:** update types ([442cb52](https://github.com/fsd-nodejs/service-mw2/commit/442cb52ad6e3301069ac0bc205b82c09e450b76a))
* **apm:** use pkg.name as serviceName ([47b629b](https://github.com/fsd-nodejs/service-mw2/commit/47b629bf6af91f817a99ce52fd284d3a537f55c9))
* **boilerplate:** custom-logger ([41a474a](https://github.com/fsd-nodejs/service-mw2/commit/41a474a50e5abfbc2dd3807db99c48012a11bc86))
* **deps:** update egg-jwt to v6.0.0 ([7defc6f](https://github.com/fsd-nodejs/service-mw2/commit/7defc6f55ccd059b7195d6fab61ae81541529103))
* **jaeger:** using midway-component-jaeger ([02f62db](https://github.com/fsd-nodejs/service-mw2/commit/02f62db677b92e94a01bf10aac2a843cb8f4d9be))
* **koid:** add api `/genid` and more ([03962a0](https://github.com/fsd-nodejs/service-mw2/commit/03962a083ddc45a0204cd49e471bd956b47a706f))
* **koid:** add snowflake id generator ([272ba28](https://github.com/fsd-nodejs/service-mw2/commit/272ba289011727c6b7ba09e019ab40232d696d16))
* **koid:** generate bitint id via koid.nextBigint ([8788623](https://github.com/fsd-nodejs/service-mw2/commit/87886231e00544fcd3b39c95bddc84a4cadc1a5b))
* **middleware, ctx:** jaeger链路追踪 ([4705333](https://github.com/fsd-nodejs/service-mw2/commit/4705333562971f4d9441bce6c45caace133d7bda))
* **types:** add config.modal.ts ([9a5e64d](https://github.com/fsd-nodejs/service-mw2/commit/9a5e64ddda27342a9783e169d8e02c18da527234))
* check 'ValidationError' also wit message ([8580b5a](https://github.com/fsd-nodejs/service-mw2/commit/8580b5aba25246585d32f9c7dbf8d61be9e5fe31))
* create file .gitpod.yml ([6feb1b4](https://github.com/fsd-nodejs/service-mw2/commit/6feb1b48dcc3c8807327dd7afc70f9c31cbec7d2))
* github workflows ([b2f5bce](https://github.com/fsd-nodejs/service-mw2/commit/b2f5bce4ef9376c7f91c844ae122a469565089a2))
* jeager链路追踪 ([46843c5](https://github.com/fsd-nodejs/service-mw2/commit/46843c533dd341f60ac53ac261ef7b9ed2977a95))
* migrate app.ts to configuration.ts ([f923cc6](https://github.com/fsd-nodejs/service-mw2/commit/f923cc60cc8d80b75bde8f91801dd9287d791be8))
* set response header x-request-id by parseRequestId() ([46ed3a8](https://github.com/fsd-nodejs/service-mw2/commit/46ed3a82ce5eea79b8883ee537f65b419404fb7a))
* store error in ctx._internalError ([025ec2b](https://github.com/fsd-nodejs/service-mw2/commit/025ec2b43569531b6056a6363171bff1a1229fdb))
* update git commitlint configurations ([26e6163](https://github.com/fsd-nodejs/service-mw2/commit/26e61632d9327f263c2ef5cda9ff1b7710d51383))
* update jwt-auth.ts ([2e917fa](https://github.com/fsd-nodejs/service-mw2/commit/2e917fa54da90ea0f6857af7697b4fe769aad85b))
* **types:** update DefaultConfig ([83c0c82](https://github.com/fsd-nodejs/service-mw2/commit/83c0c824268d0eff10fa0249ee44cf26c2ad0d53))
* **util:** add retrieveExternalNetWorkInfo() ([d669cc6](https://github.com/fsd-nodejs/service-mw2/commit/d669cc661af4b27d0a594669b8bab5327a7aa5ac))
* use midway-logger instead of egg-logger ([4c66de5](https://github.com/fsd-nodejs/service-mw2/commit/4c66de53be79ddb03245b704a588ccf860462427))
* use slice() instead of substring() ([79e3dcc](https://github.com/fsd-nodejs/service-mw2/commit/79e3dcc747410281b9020e20062dd1f568bee96a))
* 增加commit校验依赖 ([09d52a0](https://github.com/fsd-nodejs/service-mw2/commit/09d52a0b47670161dc0e619f76b20f070ab18757))
* 增加husky ([f31263d](https://github.com/fsd-nodejs/service-mw2/commit/f31263d91b1e9fbd7528cb92d78fbdf968f1b2a7))
* 更新依赖版本 ([46b898c](https://github.com/fsd-nodejs/service-mw2/commit/46b898c12a14e732e6515980d7881643fdf47b7f))


### Bug Fixes

* remove Node.js 10.x version ([a53b4d2](https://github.com/fsd-nodejs/service-mw2/commit/a53b4d2ad0605c7a9294b9b21229bfb942a70c32))
* scripts.debug ([c9a5f74](https://github.com/fsd-nodejs/service-mw2/commit/c9a5f7451acb91614a82839fe2ae13b1b6741f4f))
* update trace condition ([3a0b94e](https://github.com/fsd-nodejs/service-mw2/commit/3a0b94e49b2cb96af99e4084ec22977dd9c55f06))
* var assignment of MyError.status ([0599bc8](https://github.com/fsd-nodejs/service-mw2/commit/0599bc8e565e31a872fdec735a268745ea9a0af2))
* 修复husky问题 ([e861541](https://github.com/fsd-nodejs/service-mw2/commit/e8615419d1946e16272665e1b8ef9613ef7ca8dd))
* 修复测测试用例方法使用以及定义 helper 的 this 属性 ([7d4179c](https://github.com/fsd-nodejs/service-mw2/commit/7d4179c6be0f94bbcffe35c83590ce255264caca))
* 修复测试用例取值问题 ([0db6e72](https://github.com/fsd-nodejs/service-mw2/commit/0db6e724af6ba63f421029a251c70e9cc4996f4f))
