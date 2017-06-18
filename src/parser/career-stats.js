import K, * as U from 'karet.util';
import * as L from 'partial.lenses';
import * as R from 'ramda';
import { fromNodeCallback as fromCb } from 'kefir';

import { parseCardTable } from './parsers/common';
import * as H from '../common/util';

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

const parsePair = ([k, v]) => [H.camelCase(k), condFormat(v)];
const parsePairs = R.compose(R.map(parsePair), R.prop('content'));

const mapTable = r => fromCb(H.xF3(r, 'table', { title: '.stat-title', content: ['td'] }));

const mapCategory = R.curry((category, r) =>
  fromCb(H.xF3(r,
               '.career-stats-section',
               H.xF2(`[data-category-id="${category}"]`, ['.card-stat-block@html']))));

export const parseCareerStats = R.curry((category, root) =>
  U.seq(root,
        U.flatMapLatest(mapCategory(category)),
        U.map(mapTable),
        U.flatMapLatest(K),
        U.flatten,
        U.map(L.modify(['content', L.define({})],
                       R.splitEvery(2))),
        U.map(r => R.merge(r, { content: R.compose(R.fromPairs, parsePairs)(r) })),
        U.flatMapLatest(L.collect([L.elems, L.values])),
        U.flatMapLatest(R.compose(R.fromPairs,
                                  R.map(R.adjust(H.camelCase, 0)),
                                  R.splitEvery(2)))));
