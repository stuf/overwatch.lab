/* eslint-disable no-confusing-arrow, camelcase */
import {
  pipe,
  compose,
  map,
  reverse,
  equals,
  curry,
  replace,
  is,
  toPairs,
  fromPairs,
  head,
  find,
  flip,
} from 'ramda';
import * as U from 'karet.util';
import {
  Observable,
  constant,
  fromNodeCallback as Kefir_fromNodeCallback,
  fromPromise as Kefir_fromPromise,
} from 'kefir';
import * as Dfns from 'date-fns';
import Xray from 'x-ray';

// Basic helper functions

export const trim = value => is(String, value) ? value.trim() : value;
export const asNumber = value => parseInt(value, 10);
export const asFloat = value => parseFloat(value, 10);
export const unLocalizeNumber = compose(replace(/[^\d.-]+/), asNumber);

// X-ray

export const x = Xray({ filters: { trim, asNumber, asFloat, unLocalizeNumber } });
export const xF2 = curry((data, sel) => x(data, sel));
export const xF3 = curry((data, ctx, sel) => x(data, ctx, sel));
export const xU2 = (a, b) => U.lift(xF2)(a, b); // lifted version might not be needed
export const xU3 = (a, b, c) => U.lift(xF3)(a, b, c); // lifted version might not be needed

// Kefir

export const toConstant = a => a instanceof Observable ? a : constant(a);
export const fromPromise = curry(Kefir_fromPromise);
export const fromNodeCallback = curry(Kefir_fromNodeCallback);

// date-fns

const Dfns_dateFormat = flip(Dfns.format);

export const dateFormat = curry(Dfns_dateFormat);

//

export const seq = (a, ...fns) => pipe(...fns)(a);
export const seqR = (a, ...fns) => compose(...fns)(a);

// Objects

export const getKeyByValue = curry((val, obj) =>
  compose(head,
          find(([, v]) => equals(val, v)),
          toPairs)(obj));

export const flipObject = compose(fromPairs, map(reverse), toPairs);
export const mapPairs = fn => compose(fromPairs, map(fn), toPairs);
export const seqPairs = (...fns) => compose(fromPairs, pipe(...fns), toPairs);
