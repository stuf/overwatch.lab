/* eslint-disable no-underscore-dangle, no-confusing-arrow */
import { fromPromise as fromP } from 'kefir';
import K, * as U from 'karet.util';
import * as L from 'partial.lenses';
import * as R from 'ramda';
import r from 'rethinkdb';

import { mkLogger } from '../common/logger';
import { DB_NAME, Table, connectionOptions } from './config';

//

const logger = mkLogger('src:db:index');

//

const dbName = process.env.NODE_ENV !== 'development' ? DB_NAME : 'dev';

logger.info(`Using \`${dbName}\` as database.`);

//

const db = r.db(dbName);
const profiles = db.table(Table.PROFILE);
const highlights = db.table(Table.AVERAGE);

const connect = r.connect(connectionOptions);
const connection = K(fromP(connect), R.identity);

//

export const run = query =>
  U.seq(connection,
        U.flatMapLatest(conn => fromP(query.run(conn))));

export const toArray = cursor => fromP(cursor.toArray());

//

export const getProfile = name =>
  U.seq(run(profiles.filter({ name })),
        U.flatMapLatest(toArray),
        U.lift(R.head));

//

export const pushHighlightStats = avgs =>
  run(highlights.insert(r.expr(avgs)
                         .merge({ createdAt: r.now() })));

export const pushAveragesForUser = (profileId, avgs) =>
  run(highlights.insert(r.expr(avgs)
                         .merge({
                           createdAt: r.now(),
                           profile: profileId,
                         })));

//

export const putPlayer = (profileId, player) =>
  run(db.table(Table.PLAYER)
        .insert(r.expr(player)
                 .merge({ modifiedAt: r.now() })));

//
