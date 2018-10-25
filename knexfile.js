// Update with your config settings.


module.exports = {

  development: {
    client: 'pg',
    connection: {
        user: 'slots',
        host: `localhost`,
        password: 'slots',
        database: 'login'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }
  }
};
