/* eslint-disable no-useless-escape */
import fs from 'fs';
import path from 'path';
import K, * as U from 'karet.util';
import * as R from 'ramda';
import * as D from 'date-fns';

import * as H from './common/util';
import { mkLogger } from './common/logger';

import * as DB from './db';
import { getProfileFor, getMockProfile } from './scraper';

import { Heroes } from './parser/constants';
import { parseCareerStats } from './parser/career-stats';
import { parseHighlights } from './parser/highlights';
import { parsePlayer } from './parser/player';

//

const dataTargetDir = path.resolve(__dirname, '..', 'data', 'json');
const getUserId = U.lift(R.prop('id'));

//

export default () => {
  const logger = mkLogger('src:main');
  const { NODE_ENV, USE_MOCK } = process.env;

  logger.info('NODE\_ENV is', `\`${NODE_ENV}\``);
  logger.info('USE\_MOCK is', `\`${USE_MOCK ? 'on' : 'off'}\``);
  logger.info();

  //

  const _p = ['piparkaq', '2318']; // mock

  const userProfile = DB.getProfile(_p[0]);
  const userId = getUserId(userProfile);

  const userCareerProfile =
    !(NODE_ENV === 'development' && USE_MOCK === '1')
      ? userProfile.flatMap(({ name, tag }) => getProfileFor(name, tag))
      : getMockProfile();

  const player = userCareerProfile.flatMapLatest(parsePlayer);
  const highlights = userCareerProfile.flatMapLatest(parseHighlights);
  const careerStats = userCareerProfile.flatMapLatest(parseCareerStats(Heroes.ALL_HEROES));

  const now = R.compose(H.dateFormat('YYYY-MM-DDTHHmmss'),
                        D.startOfSecond,
                        D.getTime)(new Date());

  // Just output them for now

  if (USE_MOCK !== '1') {
    U.seq(K({ player, highlights, careerStats }, R.identity),
      U.flatMapLatest(R.compose(R.toPairs)),
      U.map(([k, v]) =>
        fs.writeFileSync(path.join(dataTargetDir, `${k}_${now}.json`),
                        JSON.stringify(v, null, 2))))
      .log('write')
      .observe(R.identity);
  }
  else if (USE_MOCK === '1') {
    // highlights.log('highlights');
    careerStats.log('careerStats');
  }
};
