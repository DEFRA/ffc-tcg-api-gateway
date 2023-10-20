const Wreck = require('@hapi/wreck')
const { BASE_URL } = require('../constants/base-url')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { GET } = require('../constants/http-verbs')
const { USER } = require('../constants/scopes')

module.exports = [{
/**
 * Get a forms content, selection options and current data
 * @param {string} applicationId - unique ID for the application
 * @param {string} formType - name of the form
 * @return {object} object containing the form definition, content, selection options and submitted form data
 */
  method: GET,
  path: '/forms/{formType}/{applicationId}',
  options: { auth: { strategy: 'simple', scope: [USER] } },
  handler: async (request, h) => {
    const form = await Wreck.get(`${BASE_URL}/application-forms/master/api-priv/v1/applications/${request.params.applicationId}/declarations/${request.params.formType}`, WRECK_OPTIONS(request))
    return h.response({
      formData: form.payload.document,
      formContent: form.payload.documentDefinition
    }).code(200)
  }
}]
