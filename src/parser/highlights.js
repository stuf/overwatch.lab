/* eslint-disable no-underscore-dangle */
/**
 * Provides a parser for a career page that returns a "career highlights" object.
 */
import * as L from 'partial.lenses';
import * as R from 'ramda';

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

const HighlightStat = {
  empty: R.always({}),
  concat: (x, y) => R.merge(pairToObj(x), y),
};

//

const getKeyByValue = R.curry((val, obj) =>
  R.compose(R.head,
            R.find(([, v]) => R.equals(val, v)),
            R.toPairs)(obj));

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
  R.compose(L.concat(HighlightStat,
                       [L.elems,
                        highlightStatL]),
            R.splitEvery(2))(root.find(SELECTOR)
                                 .find('.card-content')
                                 .children()
                                 .toArray());

//

export default {
  parseHighlights,
};
