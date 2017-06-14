import Logdown from 'logdown';
import pkg from '../package.json';

import { mkLogger } from './common/logger';

const logger = mkLogger('src:index');

logger.info(`*${pkg.name} ${pkg.version}*`);
logger.info('Starting up');

require('./main').default();
