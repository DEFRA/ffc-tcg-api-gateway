const Wreck = require('@hapi/wreck')
const { WRECK_OPTIONS } = require('../constants/wreck-options')

const getSelectedActions = async (request) => {
  const actions = await Wreck.get(`http://ffc-tcg-api-gateway:3004/actions/${request.params.applicationId}`, WRECK_OPTIONS(request))
  const selectedActions = actions.payload.filter(action => action.value === true).map(selectedActions => selectedActions.prizeTitle.split(' - ')[0])

  const fundingData = await Promise.all(selectedActions.map(async (action) => {
    const data = await Wreck.get(`http://ffc-tcg-api-gateway:3004/actions/${request.params.applicationId}/${action}`, WRECK_OPTIONS(request))
    return {
      actionName: data.payload.content[0].optionDescription,
      parcels: data.payload.parcels.length,
      selectedArea: data.payload.content[0].engagedArea / 10000
    }
  }))

  return fundingData
}

module.exports = { getSelectedActions }
