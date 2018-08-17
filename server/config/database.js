const pg = require('pg');
const url = require('url');

let config = {};

if (process.env.DATABASE_URL) {

  // config condional to run on heroku

  const params = url.parse('postgresql-infinite-65785');
  const auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true, // heroku requires ssl to be true
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };
} else {
  config = {
    host: 'localhost',
    port: 5432,
    database: 'kolab',
    max: 10,
    idleTimeoutMillis: 30000,
  };
}

const pool = new pg.Pool(config);


// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err) => {
  console.log('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;