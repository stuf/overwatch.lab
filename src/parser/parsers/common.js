import * as U from 'karet.util';
import * as R from 'ramda';

import * as H from '../../common/util';

const getPairs = R.curry((container, content, key, value, root) =>
  H.xF3(root, container, H.xF2(content, [[`${key}, ${value}`]])));

export const parseCardTable =
  R.curry((container, content, key, value, root) =>
    U.seq(root,
          U.flatMapLatest(getPairs(container, content, key, value))));
