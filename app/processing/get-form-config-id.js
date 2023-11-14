const Wreck = require('@hapi/wreck')
const { BASE_URL } = require('../constants/base-url')
const { WRECK_OPTIONS } = require('../constants/wreck-options')

const getFormConfigId = async (request, applicationId, actionId) => {
  const response = await Wreck.get(`${BASE_URL}/applications/master/api-priv/v1/applications/${applicationId}`, WRECK_OPTIONS(request))
  const form = response.payload.forms.find(form => form.formDetails.formCode === `OPTION_${actionId}`)
  return form.formDetails.formConfigId
}

module.exports = { getFormConfigId }
