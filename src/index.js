import * as DB from './db';
import { getProfileFor } from './scraper';

import { parseHighlights } from './parser/highlights';
import { parsePlayer } from './parser/player';

//

const _p = ['piparkaq', '2318'];

const userProfile = DB.getProfile(_p[0]);
const userCareerProfile = userProfile.flatMap(({ name, tag }) => getProfileFor(name, tag));

const highlights = userCareerProfile.map(parseHighlights);
const player = userCareerProfile.map(parsePlayer);

//

highlights.flatMap(DB.pushHighlightStats).log('push stats');

highlights.log('highlights');
player.log('player');
