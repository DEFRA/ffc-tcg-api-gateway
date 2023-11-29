const Wreck = require('@hapi/wreck')
const { BASE_URL } = require('../constants/base-url')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { GET } = require('../constants/http-verbs')
const { USER } = require('../constants/scopes')

module.exports = [
  {
    /**
 * Return party details for a given partyId
 * @param {string} partyId - unique ID for of the party
 * @return {object} object containing details of the party
 */
    method: GET,
    path: '/parties/{partyId}',
    options: { auth: { strategy: 'simple', scope: [USER] } },
    handler: async (request, h) => {
      console.log(`Request received: ${request.params}`)
      console.log(`Base URL: ${BASE_URL}`)
      const partyDetails = await Wreck.get(`${BASE_URL}/party-registry/master/api-priv/v1/parties/${request.params.partyId}`, WRECK_OPTIONS(request))
      return h.response({
        ...partyDetails.payload
      }).code(200)
    }
  }]
