/* eslint-disable no-underscore-dangle */
/**
 * Provides a parser for a career page that returns a "career highlights" object.
 */
import * as U from 'karet.util';
import * as R from 'ramda';

import { xF2, xF3, fromNodeCallback as fromCb, camelCase } from '../common/util';

//

const camelCasePair = R.compose(R.adjust(camelCase, 0), R.reverse);
const camelCasePairs = R.compose(R.fromPairs, R.map(camelCasePair));
const parsePairs = r => fromCb(xF3(r, '.highlight-stats', xF2('.card-content', [['.card-heading, .card-copy']])));

export const parseHighlights =
  U.pipe(U.flatMapLatest(parsePairs),
         U.flatMapLatest(camelCasePairs));

//

export default {
  parseHighlights,
};
