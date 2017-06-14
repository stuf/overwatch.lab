/* eslint-disable no-underscore-dangle */
/**
 * Provides a parser for a career page that returns a "career highlights" object.
 */
import * as U from 'karet.util';
import * as L from 'partial.lenses';
import * as R from 'ramda';
import Xray from 'x-ray';

import { getKeyByValue } from '../common/util';
import { x, xF2, xF3, fromCb } from './helper';

//

export const SELECTOR = '.highlights-section';

//

const pairToObj =
  R.compose(R.fromPairs,
            R.of,
            R.values);

//

const HIGHLIGHT_KEY_INDEX = 1;
const HIGHLIGHT_VALUE_INDEX = 0;

const highlightKeys = {
  avgElims: 'Eliminations - Average',
  avgDamageDone: 'Damage Done - Average',
  avgDeaths: 'Deaths - Average',
  avgFinalBlows: 'Final Blows - Average',
  avgHealingDone: 'Healing Done - Average',
  avgObjectiveKills: 'Objective Kills - Average',
  avgObjectiveTime: 'Objective Time - Average',
  avgSoloKills: 'Solo Kills - Average',
};

const highlightKeysInv =
  R.compose(R.fromPairs,
            R.map(R.reverse),
            R.toPairs)(highlightKeys);

const HighlightStat = {
  empty: R.always({}),
  concat: (x, y) => R.merge(pairToObj(x), y),
};

//

const dataL =
  [L.when(x => R.is(Array, x) && R.length(x) > 0),
   L.index(0),
   'data'];

const childrenIn = i => [i, 'children'];

const getKeyValueL = type => [childrenIn(type), dataL];

const highlightStatL =
  [L.when(x => R.length(x) >= 2),
   L.pick({
     key: [getKeyValueL(HIGHLIGHT_KEY_INDEX),
           L.normalize(k => getKeyByValue(k, highlightKeys))],
     value: getKeyValueL(HIGHLIGHT_VALUE_INDEX),
   })];

// Featured stats

export const parseHighlights = root =>
  U.seq((root),
        U.flatMapLatest(r => xF3(r, '.highlights-section .card-content', [{
          key: '.card-copy',
          value: '.card-heading',
        }])),
        U.flatMapLatest(fromCb),
        U.flatMapLatest(
          R.compose(
            R.fromPairs,
            R.map(([k, v]) => [R.prop(k, highlightKeysInv), v]),
            R.map(
              R.compose(
                R.map(R.last),
                R.toPairs)))));

//

export default {
  parseHighlights,
};
