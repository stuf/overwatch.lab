/* eslint-disable no-useless-escape */
import * as R from 'ramda';

import { mkLogger } from './common/logger';

import * as DB from './db';
import { getProfileFor, getMockProfile } from './scraper';

import { Heroes } from './parser/constants';
import { parseCareerStats } from './parser/career-stats';
import { parseHighlights } from './parser/highlights';
import { parsePlayer } from './parser/player';

//

export default () => {
  const logger = mkLogger('src:main');
  const { NODE_ENV, USE_MOCK } = process.env;

  logger.info('NODE\_ENV is', `\`${NODE_ENV}\``);
  logger.info('USE\_MOCK is', `\`${USE_MOCK ? 'on' : 'off'}\``);

  //

  const _p = ['piparkaq', '2318']; // mock

  const userProfile = DB.getProfile(_p[0]);
  const userId = userProfile.map(R.prop('id'));

  const userCareerProfile =
    !(NODE_ENV === 'development' && USE_MOCK === '1')
      ? userProfile.flatMap(({ name, tag }) => getProfileFor(name, tag))
      : getMockProfile();

  const highlights = userCareerProfile.flatMap(parseHighlights);
  const player = userCareerProfile.flatMap(parsePlayer);
  const careerStats = userCareerProfile.flatMap(parseCareerStats(Heroes.ALL_HEROES));

  // Averages
  // const pushAverages = K(userId, highlights).flatMap(R.apply(DB.pushAveragesForUser));

  //

  highlights.log('highlights');
  player.log('player');
  careerStats.log('careerStats');
};
