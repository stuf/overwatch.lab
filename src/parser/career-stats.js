import * as U from 'karet.util';
import * as L from 'partial.lenses';
import * as R from 'ramda';

import { xF3, fromCb } from './helper';

//

export const SELECTOR = '.career-stats-section';
export const CARD_BLOCK_SELECTOR = '.card-stat-block';

//

export const parseCareerStats = R.curry((category, root) =>
  U.seq(root,
        U.flatMapLatest(r => xF3(r, `.career-stats-section [data-category-id="${category}"] .card-stat-block`, [{
            title: '.stat-title',
            data: ['td'],
          }])),
        U.flatMapLatest(fromCb),
        U.lift(L.modify([L.elems, 'data'],
                         R.compose(R.fromPairs,
                                   R.splitEvery(2))))));
