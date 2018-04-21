/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  '*': false,
  'users/login': true,
  'users/register-participant': true,
  'users/userinfo': 'isUser',
  'pyramids/create-pyramid': ['isUser', 'isParticipant'],
  'users/transfer-in': true,
};
