import * as R from 'ramda';
import Xray from 'x-ray';
import { fromNodeCallback } from 'kefir';

export const x = Xray();

export const xF2 = R.curry((data, sel) => x(data, sel));
export const xF3 = R.curry((data, ctx, sel) => x(data, ctx, sel));

export const fromCb = fromNodeCallback;
