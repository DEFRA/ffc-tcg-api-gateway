const Wreck = require('@hapi/wreck')
const { BASE_URL } = require('../constants/base-url')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { GET, POST } = require('../constants/http-verbs')
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
},
{
/**
 * Submit a form with user data
 *
 * @return {object} the updated form data
 */
  method: POST,
  path: '/forms/submit/{formType}/{applicationId}',
  options: { auth: { strategy: 'simple', scope: [USER] } },
  handler: async (request, h) => {
    const payload = {
      document: {
        fields:
          { IS_LAND_UPTODATE: 'N' },
        validFrom: '2022-10-11T00:00:00Z',
        validTo: '9999-12-15T00:00:00Z'
      }
    }
    const availableForms = await Wreck.get(`${BASE_URL}/applications/master/api-priv/v1/applications/${request.params.applicationId}`, WRECK_OPTIONS(request))
    const formData = availableForms.payload.forms.find(form => form.formDetails.params.document_code === request.params.formType)
    const submitForm = await Wreck.post(`${BASE_URL}/application-forms/master/api-priv/v1/applications/${request.params.applicationId}/declarations/${request.params.formType}?formConfigId=${formData.formDetails.formConfigId}&compileStatusIdentifier=${formData.formDetails.compileStatusIdentifier}&compileStatus=COMPLETED`, WRECK_OPTIONS(request, payload))
    return h.response({
      ...submitForm.payload
    }).code(200)
  }
}
]
