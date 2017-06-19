/* eslint-disable comma-dangle */
import K, * as U from 'karet.util';
import * as L from 'partial.lenses';
import * as R from 'ramda';
import { fromNodeCallback as fromCb } from 'kefir';

import * as H from '../common/util';
import { Heroes } from './constants';

const x = H.x;

//

const not = R.complement;

const formatTime = v => v;
const formatNumber = R.compose(parseFloat, R.replace(/,/, ''));

const numberCond = R.test(/\d+,?\d+/);
const timeCond = R.test(/\d+:\d+/);

const timeFormatCond = R.and(numberCond, not(timeCond));

const condFormat =
  R.cond([
    [timeCond, formatTime],
    [timeFormatCond, formatNumber],
  ]);

//

const fromEls = prop => [L.elems, prop];
const intoObject = R.compose(R.transpose, R.splitEvery(2));

const childData = [fromEls('children'), fromEls('data')];

//

export const parse =
  r => H.fromCb(x(r, '.js-stats', [{
    id: '@data-category-id',
    children: x('.data-table', [{
      title: '.stat-title',
      data: ['td'],
    }]),
  }]));

export const parseCategories =
  U.pipe(U.flatMapLatest(parse),
         U.flatMapLatest(L.modify(childData, intoObject)));
