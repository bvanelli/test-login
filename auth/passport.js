const passport = require('passport');
const knex = require('../db/connection');

module.exports = () => {

  passport.serializeUser((user, done) => {
    done(null, user.id_usuario);
  });

  passport.deserializeUser((id_usuario, done) => {
    knex('users').where({id_usuario}).first()
    .then((user) => { done(null, user); })
    .catch((err) => { done(err,null); });
  });

};

