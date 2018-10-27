const bcrypt = require('bcryptjs');
const knex = require('../db/connection');
const uuidv4 = require('uuid/v4');
const validator = require('validator');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createUser(req, res) {
  return validateSignup(req)
  .then((sanitize) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const uuid = uuidv4();
    return knex('users')
    .insert({
      id_usuario: uuid,
      id_assinante: uuid,
      username: req.body.username,
      password: hash,
      endereco: req.body.endereco,
      email: sanitize.email
    })
    .returning('*');
  })
  .catch((err) => {
    res.status(400).json({status: err.detail});
  });
}

function loginRequired(req, res, next) {
  if (!req.user) return res.status(401).json({status: 'Please log in'});
  return next();
}

function adminRequired(req, res, next) {
  if (!req.user) res.status(401).json({status: 'Please log in'});
  return knex('users').where({username: req.user.username}).first()
  .then((user) => {
    if (!user.paid) res.status(401).json({status: 'You are not authorized'});
    return next();
  })
  .catch((err) => {
    res.status(500).json({status: 'Something bad happened'});
  });
}

function loginRedirect(req, res, next) {
  if (req.user) return res.status(401).json(
    {status: 'You are already logged in'});
  return next();
}

function validateSignup(req) {
  return new Promise((resolve, reject) => {
    if (!validator.isLength(req.body.username, {min:6, max: 30})) {
      reject({
        detail: 'Username must be longer than 6 characters and less than 30 characters.'
      });
    }
    else if (!validator.isLength(req.body.password, {min:6, max: 30})) {
      reject({
        detail: 'Password must be longer than 6 characters and less than 30 characters.'
      });
    } 
    else if (!validator.isEmail(req.body.email)) {
      reject({
        detail: 'Please insert a valid email.'
      });
    } else {
      var sanitize = {};
      sanitize.email = validator.normalizeEmail(req.body.email);
      resolve(sanitize);
    }
  });
}

module.exports = {
  comparePass,
  createUser,
  loginRequired,
  adminRequired,
  loginRedirect
};
