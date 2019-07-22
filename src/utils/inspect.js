import { inspect } from 'util';
import { info } from 'winston';

export const inspectObj = obj => inspect(obj, false, null, true);
export const logObj = obj => info(inspectObj(obj));
export const tapObj = (label = '') => obj => {
  info(...(label ? [label, inspectObj(obj)] : inspectObj(obj)));
  return obj;
};

export default inspectObj;
