import * as U from 'karet.util';
import * as R from 'ramda';

import { xF3, fromCb } from '../common/util';

//

export const SELECTOR = '#overview-section';

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
