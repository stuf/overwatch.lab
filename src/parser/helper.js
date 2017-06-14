/* eslint-disable no-confusing-arrow */
import * as R from 'ramda';
import Xray from 'x-ray';
import { fromNodeCallback } from 'kefir';

//

const filters = {
  trim: value => typeof value === 'string' ? value.trim() : value,
  asNumber: value => parseInt(value, 10),
  asFloat: value => parseFloat(value, 10),
};

export const x = Xray({ filters });
export const xF2 = R.curry((data, sel) => x(data, sel));
export const xF3 = R.curry((data, ctx, sel) => x(data, ctx, sel));

//

export const fromCb = fromNodeCallback;

//

export const flipObj = R.compose(R.fromPairs,
                                 R.map(R.reverse),
                                 R.toPairs);
