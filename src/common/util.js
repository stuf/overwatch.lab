import * as R from 'ramda';

export const seq = (x, ...fns) => R.pipe(...fns)(x);

export const seqR = (x, ...fns) => R.compose(...fns)(x);
