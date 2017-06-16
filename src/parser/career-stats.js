import * as U from 'karet.util';
import * as L from 'partial.lenses';
import * as R from 'ramda';

import { xF2, xF3, fromCb } from './helper';

//

export const SELECTOR = '.career-stats-section';
export const CARD_BLOCK_SELECTOR = '.card-stat-block';

//

export const parseCareerStats = R.curry((category, root) =>
  U.seq(root,
        U.flatMapLatest(r =>
          fromCb(xF3(r,
                     `.career-stats-section [data-category-id="${category}"]`,
                     ['.card-stat-block@html']))),
        U.map(U.show),
        // U.lift(L.modify([L.elems, 'data'], R.identity)),
  ));
