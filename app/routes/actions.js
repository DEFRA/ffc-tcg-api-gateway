const Wreck = require('@hapi/wreck')
const { BASE_URL } = require('../constants/base-url')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { GET, POST } = require('../constants/http-verbs')
const { USER } = require('../constants/scopes')

module.exports = [{
  /**
   * get available actions
   * @param {string} applicationId - unique ID of the application.
   * @return {array} array of objects containing details for the available actions.
   */
  method: GET,
  path: '/actions/{applicationId}',
  options: { auth: { strategy: 'simple', scope: [USER] } },
  handler: async (request, h) => {
    const application = await Wreck.get(`${BASE_URL}/application-forms/master/api-priv/v1/applications/${request.params.applicationId}/prize-choices`, WRECK_OPTIONS(request))
    return h.response(application.payload).code(200)
  }
},
{
  /**
   * save selected actions
   * @param {string} applicationId - unique ID of the application.
   * @param {array} mappedActions - array of objects containing the selected prize codes
   * @return {array} array of objects containing details for the available actions.
   */
  method: POST,
  path: '/actions/{applicationId}',
  options: { auth: { strategy: 'simple', scope: [USER] } },
  handler: async (request, h) => {
    const submittedActions = await Wreck.post(`${BASE_URL}/application-forms/master/api-priv/v1/applications/${request.payload.applicationId}/prize-choices?formConfigId=211&compileStatusIdentifier=PRIZE_CHOICE`, WRECK_OPTIONS(request, request.payload.mappedActions))
    return h.response(submittedActions.payload).code(200)
  }
}
]
