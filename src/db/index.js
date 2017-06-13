/* eslint-disable no-underscore-dangle, no-confusing-arrow */
import Kefir, { fromNodeCallback as intoK, fromPromise as fromP } from 'kefir';
import K, * as U from 'karet.util';
import * as R from 'ramda';
import r from 'rethinkdb';
import Logdown from 'logdown';

import { DB_NAME, Table, connectionOptions } from './config';

//

const logger = new Logdown({ prefix: 'db' });

const _id = '779ddc41-68b5-4b8f-811f-60037e6d313a';

//

const dbName = process.env.NODE_ENV !== 'development' ? DB_NAME : 'dev';

logger.info(`Using \`${dbName}\` as database.`);

//

const db = r.db(dbName);
const profiles = db.table(Table.PROFILE);
const highlights = db.table(Table.AVERAGE);

// //

const withProfile = o =>
  R.merge(o, { profile: _id });

const withMeta = o =>
  R.merge(o, { createdAt: new Date() });

// //

const connect = r.connect(connectionOptions);
const connection = K(fromP(connect), R.identity);

// //

export const run = query =>
  U.seq(connection,
        U.flatMapLatest(conn =>
          Kefir.fromPromise(query.run(conn))));

// //

// export const table = name => db.table(name);

// //

export const toArray = cursor => fromP(cursor.toArray());

// //

// export const changesFrom = query => intoK(run(query.changes()));

// // curried point-free:
// //   averagesDb = run ∘ mergeWithMeta ∘ insert

const withExtra = R.compose(withProfile, withMeta);

// //

export const getProfile = name =>
  U.seq(run(profiles.filter({ name })),
        U.flatMapLatest(toArray),
        U.lift(R.head));

// //

export const pushHighlightStats = avgs =>
  U.seq(connection,
        U.flatMapLatest(conn =>
          intoK(cb => highlights.insert(withExtra(avgs))
                                .run(conn, cb))));

// export const insertProfile = profile =>
//   U.seq(connection,
//         U.flatMapLatest(conn =>
//           intoK(cb => profiles.insert(withExtra(profile))
//                               .run(conn, cb))));

// //

// export default run;
