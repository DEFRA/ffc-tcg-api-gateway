const Wreck = require('@hapi/wreck')
const { BASE_URL } = require('../constants/base-url')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { GET, POST } = require('../constants/http-verbs')
const { USER } = require('../constants/scopes')
const { getFormConfigId } = require('../processing/get-form-config-id')

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
   * get form content for individual scheme actions including available parcels
   * @param {string} applicationId - unique ID of the application.
   * @param {string} actionId - unique ID of the type of action selected eg IGL1.
   * @return {array} array of objects containing details for the available actions.
   */
  method: GET,
  path: '/actions/{applicationId}/{actionId}',
  options: { auth: { strategy: 'simple', scope: [USER] } },
  handler: async (request, h) => {
    const { applicationId, actionId } = request.params
    const formConfigId = await getFormConfigId(request, applicationId, actionId)
    const content = await Wreck.get(`${BASE_URL}/application-forms/master/api-priv/v1/applications/${applicationId}/forms/OPTION_${actionId}/options?option_code=${actionId}&formConfigId=${formConfigId}`, WRECK_OPTIONS(request))
    const parcels = await Wreck.get(`${BASE_URL}/application-forms/master/api-priv/v1/applications/${applicationId}/options/${actionId}/areas?option_code=${actionId}&formConfigId=${formConfigId}`, WRECK_OPTIONS(request))

    return h.response({
      content: content.payload,
      parcels: parcels.payload.records
    }).code(200)
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
},
{
  /**
   * submit chosen parcels
   * @param {string} applicationId - unique ID of the application.
   * @param {string} actionId - unique ID of the type of action selected eg IGL1.
   * NB can only selectAll - no current functionality to submit individual parcels
   */
  method: POST,
  path: '/actions/submit',
  options: { auth: { strategy: 'simple', scope: [USER] } },
  handler: async (request, h) => {
    const { applicationId, actionCode } = request.payload
    const formConfigId = await getFormConfigId(request, applicationId, actionCode)
    const submittedParcels = await Wreck.post(`${BASE_URL}/application-forms/master/api-priv/v1/applications/${applicationId}/forms/OPTION_IGL1/options?option_code=${actionCode}&formConfigId=${formConfigId}&compileStatusIdentifier=OPTION_${actionCode}&action=ENGAGE_ALL`, WRECK_OPTIONS(request, [{ optionCode: actionCode }]))
    return h.response(submittedParcels.payload).code(200)
  }
}
]
