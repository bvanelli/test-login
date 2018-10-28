const express = require('express');
const router = express.Router();


const authHelpers = require('../auth/utils');
const passport = require('../auth/local');

/**
 * @api {get} /auth/signup Register a new user on the database.
 * @apiName Signup
 * @apiGroup Login
 *
 * @apiParam {String} username Username for the user.
 * @apiParam {String} password Password for the user.
 * @apiParam {String} endereco Address for the user.
 * @apiParam {String} email Email for the user.
 *
 * @apiSuccess {String} status Success message.
 * @apiError {String} status Error message related to query.
 */
router.post('/signup', authHelpers.loginRedirect, (req, res, next)  => {
  return authHelpers.createUser(req, res)
  .then((response) => {
    passport.authenticate('local', (err, user, info) => {
      if (user) { handleResponse(res, 200, 'success'); }
    })(req, res, next);
  })
  .catch((err) => { handleResponse(res, 500, 'error'); });
});

/**
 * @api {get} /auth/login Login with user.
 * @apiName Login
 * @apiGroup Login
 *
 * @apiParam {String} username Username for the user.
 * @apiParam {String} password Password for the user.
 *
 * @apiSuccess {String} status Success message.
 * @apiError {String} status Error message related to query.
 */
router.post('/login', authHelpers.loginRedirect, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { handleResponse(res, 500, 'error'); }
    if (!user) { handleResponse(res, 404, 'Wrong password or User not found'); }
    if (user) {
      req.login(user, function (err) {
        console.log(err);
        if (err) { handleResponse(res, 500, 'error'); }
        handleResponse(res, 200, 'success');
      });
    }
  })(req, res, next);
});

/**
 * @api {get} /auth/logout Logs out the user session.
 * @apiName Logout
 * @apiGroup Login
 *
 * @apiSuccess {String} status Success message.
 * @apiError {String} status In case user is not logged in.
 */
router.get('/logout', authHelpers.loginRequired, (req, res, next) => {
  req.logout();
  handleResponse(res, 200, 'success');
});

// *** helpers *** //

function handleLogin(req, user) {
  return new Promise((resolve, reject) => {
    req.login(user, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg});
}


module.exports = router;
