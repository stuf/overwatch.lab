import K, * as U from 'karet.util';
import * as R from 'ramda';
import * as DB from './db';
import { getProfileFor, getMockProfile } from './scraper';

import { Heroes } from './parser/constants';
import { parseCareerStats } from './parser/career-stats';
import { parseHighlights } from './parser/highlights';
import { parsePlayer } from './parser/player';

//

const _p = ['piparkaq', '2318'];

const userProfile = DB.getProfile(_p[0]); // .log('userProfile');
const userId = userProfile.map(R.prop('id')); // .log('userId');

// const userCareerProfile = userProfile.flatMap(({ name, tag }) => getProfileFor(name, tag));
const userCareerProfile = getMockProfile();

const highlights = userCareerProfile.flatMap(parseHighlights);
// const player = userCareerProfile.map(parsePlayer);
const careerStats = userCareerProfile.flatMap(parseCareerStats(Heroes.ALL_HEROES));

//
// Averages

// const pushAverages = K(userId, highlights).flatMap(R.apply(DB.pushAveragesForUser));

//

highlights.log('highlights');
// player.log('player');
careerStats.log('careerStats');
