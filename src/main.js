/* eslint-disable no-useless-escape */
import K, * as U from 'karet.util';
import * as R from 'ramda';

import { mkLogger } from './common/logger';

import * as DB from './db';
import { getProfileFor, getMockProfile } from './scraper';

import { Heroes } from './parser/constants';
import { parseCareerStats } from './parser/career-stats';
import { parseHighlights } from './parser/highlights';
import { parsePlayer } from './parser/player';

//

const getUserId = U.lift(R.prop('id'));

export default () => {
  const logger = mkLogger('src:main');
  const { NODE_ENV, USE_MOCK } = process.env;

  logger.info('NODE\_ENV is', `\`${NODE_ENV}\``);
  logger.info('USE\_MOCK is', `\`${USE_MOCK ? 'on' : 'off'}\``);

  //

  const _p = ['piparkaq', '2318']; // mock

  const userProfile = DB.getProfile(_p[0]).log('userProfile');
  const userId = getUserId(userProfile).log('userId');

  const userCareerProfile =
    !(NODE_ENV === 'development' && USE_MOCK === '1')
      ? userProfile.flatMap(({ name, tag }) => getProfileFor(name, tag))
      : getMockProfile();

  // Averages
  // const pushAverages = K(userId, highlights).flatMap(R.apply(DB.pushAveragesForUser));

  const player = userCareerProfile.flatMap(parsePlayer).log();

  // Create player if it doesn't exist
  const playerExists = DB.playerExists(userId);

  U.seq(playerExists.log('exists'),
        U.flatMapLatest(DB.addPlayer(userId)));

  // Push data into DB
  // U.seq(K({ userProfile,
  //           userId,
  //           highlights: userCareerProfile.flatMap(parseHighlights),
  //           player: userCareerProfile.flatMap(parsePlayer),
  //           careerStats: userCareerProfile.flatMap(parseCareerStats(Heroes.ALL_HEROES)) }, R.identity))
  //   .log('combined');

  //

  // highlights.log('highlights');
  // player.log('player');
  // careerStats.log('careerStats');
};
