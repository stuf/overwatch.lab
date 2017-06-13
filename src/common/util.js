import * as R from 'ramda';

export const seq = (x, ...fns) => R.pipe(...fns)(x);

export const seqR = (x, ...fns) => R.compose(...fns)(x);

export const getKeyByValue = R.curry((val, obj) =>
  R.compose(R.head,
            R.find(([, v]) => R.equals(val, v)),
            R.toPairs)(obj));
