import { fromNodeCallback as cbIntoK } from 'kefir';
import * as U from 'karet.util';
import * as L from 'partial.lenses';
import * as R from 'ramda';

import { x, xF2, xF3 } from './helper';

//

export const SELECTOR = '.career-stats-section';
export const CARD_BLOCK_SELECTOR = '.card-stat-block';

//

export const parseCareerStats = R.curry((category, root) =>
  U.seq(root,
        U.flatMapLatest(r => {
          const y = xF3(r, `.career-stats-section [data-category-id="${category}"] .card-stat-block`, [{
            title: '.stat-title',
            entries: ['td'],
          }]);
          return cbIntoK(cb => y(cb));
        }),
        U.lift(L.modify([L.elems, 'entries'],
                         R.compose(R.fromPairs,
                                   R.splitEvery(2))))));
