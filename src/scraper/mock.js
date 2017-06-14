/* eslint-disable import/prefer-default-export */
import * as U from 'karet.util';
import { fromNodeCallback as cbIntoK } from 'kefir';
import fs from 'fs';
import path from 'path';
import Logdown from 'logdown';

const logger = new Logdown({ prefix: 'src/scraper/mock' });

const mockFile = path.resolve(__dirname, '..', '..', 'data', 'piparkaq-2318');

logger.info('mockFile =>', mockFile);

export const fetchMockProfile = () =>
  U.seq(cbIntoK(cb => fs.readFile(mockFile, cb)),
        U.toString);
