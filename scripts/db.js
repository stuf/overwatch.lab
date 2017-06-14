const R = require('ramda');
const U = require('karet.util');
const r = require('rethinkdb');
const Promise = require('bluebird');
const Logdown = require('logdown');

const logger = new Logdown({ prefix: 'scripts/db' });

const databases = ['dev_db', 'prod_db'];
const tables = ['profile', 'player', 'highlight_stats', 'log'];

const connOpts = { host: 'localhost', port: 28015 };

let connection;
r.connect(connOpts, (err, conn) => connection = conn);

const dbResult =
  Promise.resolve(connection)
    .then(conn => [conn, r.dbList().run(conn)])
    .map(R.identity)
    .then(([conn, dbList]) => {
      logger.info('Ensure databases exist');

      return Promise.resolve(databases)
              .filter(R.complement(R.contains(R.__, dbList)))
              .map(db => {
                logger.info(`Creating database \`${db}\``);
                return r.dbCreate(db).run(conn);
              })
              .then(res => logger.info('Done.', `${res.length} databases created.`));
    })
    .then()
    .catch(err => logger.error(err));

const tableResult =
  Promise.join(connection, dbResult)
         .then(conn => {
           logger.info('Create tables for databases');
           return Promise.map(databases,
                       dbName =>
                         R.map(t => {
                           logger.info(`Create table \`${t}\` in database ${dbName}`);
                           return r.db(dbName)
                                     .tableCreate(t)
                                     .run(conn);
                         }, tables));
         })
         .catch(err => logger.error(err));
