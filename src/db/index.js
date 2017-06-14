/* eslint-disable no-underscore-dangle, no-confusing-arrow */
import { fromPromise as fromP } from 'kefir';
import K, * as U from 'karet.util';
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
const highlights = db.table(Table.AVERAGE);

const connect = r.connect(connectionOptions);
const connection = K(fromP(connect), R.identity);

//

export const run = query => connection.flatMapLatest(conn => fromP(query.run(conn)));

export const toArray = cursor => fromP(cursor.toArray());

// Profile

export const getProfile = name =>
  U.seq(run(db.table(Table.PROFILE).filter({ name })),
        U.flatMapLatest(toArray),
        U.lift(R.head));

// Player

export const addPlayer = (profileId, player) =>
  U.seq(K(profileId, player),
        U.lift(U.show));

export const updatePlayer = (id, player) =>
  U.seq(run(player.get(id)
                  .update(r.expr(player)
                           .merge({ modifiedAt: r.now() }))));

export const putPlayer = (profileId, player) =>
  run(db.table(Table.PLAYER)
        .insert(r.expr(player)
                 .merge({ modifiedAt: r.now() })));

export const playerExists = profileId =>
  U.seq(profileId,
        U.flatMapLatest(id =>
          run(db.table(Table.PLAYER)
                .filter({ profileId: id }))),
        U.complement(U.isEmpty));

// Highlight

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

//
