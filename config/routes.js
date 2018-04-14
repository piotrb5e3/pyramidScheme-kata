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
  'get /hello': { action: 'misc/hello' },
  'post /register': { action: 'users/register-participant' },
  'post /register-admin': { action: 'users/register-admin' },
};
