/* eslint-disable no-underscore-dangle */
/**
 * Provides a parser for a career page that returns a "career highlights" object.
 */
import * as U from 'karet.util';
import * as R from 'ramda';

import { getKeyByValue } from '../common/util';
import { x, xF2, xF3, fromCb, flipObj } from './helper';

//

export const SELECTOR = '.highlights-section';

//

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

const highlightKeysInv = flipObj(highlightKeys);

//

export const parseHighlights = root =>
  U.seq((root),
        U.flatMapLatest(r =>
          fromCb(xF3(r, '.highlights-section .card-content', [{
            key: '.card-copy',
            value: '.card-heading',
          }]))),
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
