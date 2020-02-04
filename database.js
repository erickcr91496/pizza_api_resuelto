const pgPromise = require('pg-promise');
const pgp = pgPromise({});
const config = { 

    host: 'localhost',
    port: '5432',
    database: 'pizza',
    user: 'postgres',
    password: 'ericktupapi6'
}


 const db = pgp(config);
 db.any('select * from ingredient')
     .then(res=> {console.log(res); });

exports.db = db;