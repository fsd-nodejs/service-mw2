
export enum TracerTag {
  dbName = 'db',
  dbClient = 'db.client',
  dbHost = 'db.host',
  dbDatabase = 'db.database',
  dbPort = 'db.port',
  dbUser = 'db.user',
  dbCommand = 'db.command',
  callerClass = 'caller.class',
  reqId = 'reqId',
  svcIp4 = 'svc.ipv4',
  svcIp6 = 'svc.ipv6',
  svcName = 'svc.name',
  svcVer = 'svc.ver',
  resCode = 'res.code',
  message = 'message',
}

export enum TracerLog {
  error = 'error',
  requestBegin = 'tracer-request-begin',
  requestEnd = 'tracer-request-end',

  fetchStart = 'fetch-start',
  fetchFinish = 'fetch-finish',

  queryResponse = 'query-response',
  queryError = 'error',
  queryStart = 'query-start',
  queryFinish = 'query-finish',
  queryRowCount = 'row-count',
  queryCost = 'query-cost',
  queryCostThottleInSec = 'query-cost-thottle-in-sec',

  resMsg = 'res.msg',
  errMsg = 'err.msg',
  errStack = 'err.stack',
}
