/* eslint-disable no-underscore-dangle, no-confusing-arrow */
import Kefir, { fromPromise as fromP } from 'kefir';
import K, * as U from 'karet.util';
import * as L from 'partial.lenses';
import * as R from 'ramda';
import r from 'rethinkdb';

import { DB_NAME, Table, connectionOptions } from './config';

//

const _id = '779ddc41-68b5-4b8f-811f-60037e6d313a';

//

const db = r.db(DB_NAME);
const profiles = db.table(Table.PROFILE);
const highlights = db.table(Table.AVERAGE);

//

const emitConnection = R.curry((options, emitter) =>
  r.connect(
    options,
    (err, conn) => {
      if (err) {
        emitter.error(err);
        emitter.end();
      }

      emitter.emit(conn);
      emitter.end();
    }));

const connection = K(Kefir.stream(emitConnection(connectionOptions)), R.identity);

//

export const run = query =>
  U.seq(connection,
        U.flatMapLatest(conn => fromP(query.run(conn))));

//

export const table = name => db.table(name);

//

export const changesFrom = query => run(query.changes());

//

export const getProfile = (name, tag) =>
  U.seq(run(profiles.filter({ name, tag })
                    .distinct()),
        U.flatMapLatest(c => fromP(c.toArray())),
        U.lift(arr => arr && arr.length > 0 ? arr[0]
                                            : undefined));

//

export const insertStats = (profileId, stats) =>
  run(highlights.insert(r.expr(stats)
                         .merge({ createdAt: r.now() })));

// export const pushHighlightStats = avgs =>
//   run(highlights.insert(withExtra(avgs)));

//

export const insertProfile = profile =>
  run(profiles.insert(r.expr(profile)
                       .merge({ createdAt: r.now() })));

export const updateProfile = profileId =>
  run(profiles.get(profileId)
              .merge({ modifiedAt: r.now() }));

//

export default run;
