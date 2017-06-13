import { constant } from 'kefir';
import K, * as U from 'karet.util';
import * as L from 'partial.lenses';
import * as R from 'ramda';
import Logdown from 'logdown';

const logger = new Logdown({ prefix: 'parser/career-stats' });

//

const getCategorySelector = cat => `[data-category-id='${cat}']`;

//

export const SELECTOR = 'section.career-stats-section';
export const CARD_BLOCK_SELECTOR = '.card-stat-block';

//

const parseTableHead =
  U.pipe(constant,
         U.lift(node => node.find('thead .stat-title')
                            .html()));

const parseTableBody =
  U.pipe(constant,
         U.lift(node => node.find('tbody td')
                            .toArray()),
         U.map(L.get(['children',
                      L.index(0),
                      'data'])),
         U.splitEvery(2));

const parseTable = table =>
  K(parseTableHead(table),
    parseTableBody(table),
    );

//

export const parseCareerStats = R.curry((category, root) =>
  U.seq(constant(root),
        U.lift(node =>
          node.find(SELECTOR)
              .find(getCategorySelector(category))
              .find(CARD_BLOCK_SELECTOR)),
        U.lift(node => node.children().toArray()),
        U.flatMapLatest(parseTable)));
  // R.compose(R.map(parseTable),
  //           )(root.find([SELECTOR,
  //                        getCategorySelector(category),
  //                        CARD_BLOCK_SELECTOR].join(' '))
  //                 .toArray()));
