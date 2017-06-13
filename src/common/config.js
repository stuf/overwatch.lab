/* eslint-disable import/no-dynamic-require */
import path from 'path';
import Logdown from 'logdown';

import { development } from './config/index';

const logger = new Logdown({ prefix: 'config' });

const { NODE_ENV } = process.env;

logger.info(`Using \`${NODE_ENV}\` as configuration.`);
logger.info('Using configuration:', development);

export default development;
