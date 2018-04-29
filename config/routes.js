/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  'post /register': { action: 'users/register-participant' },
  'post /login': { action: 'users/login' },
  'get /userinfo': { action: 'users/userinfo' },
  'post /create-pyramid': { action: 'pyramids/create-pyramid' },
  'post /transfer-in': { action: 'users/transfer-in' },
  'post /join-pyramid': { action: 'pyramids/join-pyramid' },
};
