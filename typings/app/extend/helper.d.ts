// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!
import 'egg';
import ExtendHelper from '../../../src/app/extend/helper';
type ExtendHelperType = typeof ExtendHelper;
declare module 'egg' {
  interface IHelper extends ExtendHelperType { }
}