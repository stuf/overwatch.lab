import Logdown from 'logdown';
import pkg from '../package.json';

const logger = new Logdown({ prefix: 'src/index' });

logger.info(`${pkg.name} ${pkg.version}`);
logger.info('Starting up');

require('./main').default();
