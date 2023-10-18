const Wreck = require('@hapi/wreck')
const { BASE_URL } = require('../constants/base-url')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { GET } = require('../constants/http-verbs')
const { USER } = require('../constants/scopes')

module.exports = [{
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
}]

// create application
//
