import * as U from 'karet.util';
import * as R from 'ramda';

import { xF3, fromCb } from './helper';

//

export const SELECTOR = '#overview-section';

//

const intoNumber = n => parseInt(n, 10);

const getPlayer = root => root.find('.masthead-player');
const getPlayerName = node => node.find('.header-masthead').text();
const getPlayerLevel = node => node.find('.player-level > *').text();

//

export const parsePlayer = root =>
  U.seq(root,
        U.flatMapLatest(r => xF3(r, '.masthead-player', {
          player: '.header-masthead',
          level: '.player-level > * | asNumber',
        })),
        U.flatMapLatest(fromCb));
// export const parsePlayer = root => ({
//   name: R.compose(getPlayerName,
//                   getPlayer)(root.find(SELECTOR)),
//   level: R.compose(intoNumber,
//                    getPlayerLevel,
//                    getPlayer)(root.find(SELECTOR)),
// });
