//@flow
import * as R from 'ramda';

import { FIELD_TYPE, SMART_FORMATS } from '../constants';
import type { FieldSchema } from '../types';

const isPhoneField: (FieldSchema) => boolean = R.allPass([
  R.propEq('fieldType', FIELD_TYPE.SMART),
  R.pathEq(['fieldTypeAttributes', 'format'], SMART_FORMATS.PHONE),
]);

export { isPhoneField };
