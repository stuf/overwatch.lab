/* eslint-disable no-confusing-arrow, camelcase */
import * as R from 'ramda';
import * as U from 'karet.util';
import {
  Observable,
  constant,
  fromNodeCallback as Kefir_fromNodeCallback,
  fromPromise as Kefir_fromPromise,
} from 'kefir';
import * as Dfns from 'date-fns';
import Xray from 'x-ray';

const Dfns_dateFormat = R.flip(Dfns.format);

// Basic helper functions

export const trim = value => R.is(String, value) ? value.trim() : value;
export const asNumber = value => parseInt(value, 10);
export const asFloat = value => parseFloat(value, 10);
export const unLocalizeNumber = R.compose(R.replace(/[^\d.-]+/), asNumber);

// Strings

const replaceSeparator = R.replace(' - ', '');
const emptyJoin = R.join('');
const fstTo = R.adjust(R.__, 0);

export const capitalize = R.compose(emptyJoin, fstTo(R.toUpper), R.splitAt(1), R.toLower);
export const camelCase = R.compose(emptyJoin, fstTo(R.toLower), R.map(capitalize), R.split(' '), replaceSeparator);

// X-ray

export const x = Xray({ filters: { trim, asNumber, asFloat, unLocalizeNumber } });
export const xF1 = x;
export const xF2 = R.curry((data, sel) => x(data, sel));
export const xF3 = R.curry((data, ctx, sel) => x(data, ctx, sel));
export const xU2 = (a, b) => U.lift(xF2)(a, b); // lifted version might not be needed
export const xU3 = (a, b, c) => U.lift(xF3)(a, b, c); // lifted version might not be needed

// Kefir

export const toConstant = a => a instanceof Observable ? a : constant(a);
export const fromPromise = R.curry(Kefir_fromPromise);
export const fromNodeCallback = R.curry(Kefir_fromNodeCallback);

// date-fns

export const dateFormat = R.curry(Dfns_dateFormat);

//

export const seq = (a, ...fns) => R.pipe(...fns)(a);
export const seqR = (a, ...fns) => R.compose(...fns)(a);

// Objects

export const getKeyByValue = R.curry((val, obj) => seq(obj, R.head, R.find(([, v]) => R.equals(val, v)), R.toPairs));
export const flipObject = R.compose(R.fromPairs, R.map(R.reverse), R.toPairs);
export const mapPairs = fn => R.compose(R.fromPairs, R.map(fn), R.toPairs);
export const seqPairs = (...fns) => R.compose(R.fromPairs, R.pipe(...fns), R.toPairs);
