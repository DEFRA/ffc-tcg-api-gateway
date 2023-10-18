const Wreck = require('@hapi/wreck')
const { BASE_URL } = require('../constants/base-url')
const { WITHDRAW } = require('../constants/abaco-transitions')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { GET, POST } = require('../constants/http-verbs')
const { USER } = require('../constants/scopes')

module.exports = [{
/**
 * Returns summary of applications for a party
 * @param {string} partyId - unique ID for of the party requesting the new application.
 * @return {object} object containing all applications belonging to the partyId and details for each application.
 */
  method: GET,
  path: '/applications/summary/{partyId}',
  options: { auth: { strategy: 'simple', scope: [USER] } },
  handler: async (request, h) => {
    const applicationsPerYear = await Wreck.get(`${BASE_URL}/applications/master/api-priv/v1/applications/parties/${request.params.partyId}/years/2023`, WRECK_OPTIONS(request))
    const applicationSummary = await Wreck.get(`${BASE_URL}/applications/master/api-priv/v1/applications/parties/${request.params.partyId}/summary`, WRECK_OPTIONS(request))
    return h.response({
      records: applicationsPerYear.payload.records,
      ...applicationsPerYear.payload.count,
      ...applicationSummary.payload
    }).code(200)
  }
},
{
  /**
   * Returns transition status of an application
   * @param {string} applicationId - unique ID of the application
   * @return {object} object containing transition status last transition details and available transitions
   */
  method: GET,
  path: '/applications/status/{applicationId}',
  options: { auth: { strategy: 'simple', scope: [USER] } },
  handler: async (request, h) => {
    const applicationStatus = await Wreck.get(`${BASE_URL}/applications/master/api-priv/v1/applications/${request.params.applicationId}/is-in-transition`, WRECK_OPTIONS(request))
    const availableTransitions = await Wreck.get(`${BASE_URL}/applications/master/api-priv/v1/applications/${request.params.applicationId}/transitions`, WRECK_OPTIONS(request))
    return h.response({
      ...applicationStatus.payload,
      availableTransitions: availableTransitions.payload
    }).code(200)
  }
},
{
  /**
   * close an application
   * @param {string} applicationId - unique ID for the application
   * @param {object} notes required, set to null if no value
   * @return {object} object containing the applicationId and applicationCode
   */
  method: POST,
  path: '/applications/close/{applicationId}',
  options: { auth: { strategy: 'simple', scope: [USER] } },
  handler: async (request, h) => {
    const payload = {
      notes: null
    }
    const application = await Wreck.post(`${BASE_URL}/applications/master/api-priv/v1/applications/${request.params.applicationId}/progress/${WITHDRAW}`, WRECK_OPTIONS(request, payload))
    return h.response({ ...application.payload }).code(200)
  }
},
{
/**
 * creates an application
 * @param {string} partyId - unique ID for of the party requesting the new application.
 * @return {object} object containing the applicationId and applicationCode.
 */
  method: POST,
  path: '/applications/create/{partyId}',
  options: { auth: { strategy: 'simple', scope: [USER] } },
  handler: async (request, h) => {
    const payload = {
      partyId: request.params.partyId,
      year: '2023',
      moduleCode: 'MINI-SCHEME',
      sectorCode: 'MINI_SCHEME_SECTOR'
    }
    const application = await Wreck.post(`${BASE_URL}/applications/master/api-priv/v1/applications-async`, WRECK_OPTIONS(request, payload))

    return h.response({ ...application.payload }).code(200)
  }
}]
