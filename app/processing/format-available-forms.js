const formatAvailableForms = (forms) => {
  return [...forms.reduce((x, y) => {
    const key = y.groups[0].groupCode
    // if key doesn't exist then first instance so create new group
    const item = x.get(key) || Object.assign({}, {
      groupName: y.groups[0].groupName,
      availableForms: [{
        formConfigId: y.formDetails.formConfigId,
        formCode: y.formDetails.formCode,
        formName: y.formDetails.formName,
        compileStatusIdentifier: y.formDetails.compileStatusIdentifier,
        compileStatus: y.formDetails.compileStatus,
        url: `/${y.groups[0].groupName.replaceAll(' ', '-').toLowerCase()}`
      }]
    })
    if (x.get(key) && key === 'APPLY_SFI_ACTIONS') {
      item.availableForms.push(
        {
          formConfigId: y.formDetails.formConfigId,
          formCode: y.formDetails.formCode,
          formName: y.formDetails.formName,
          compileStatusIdentifier: y.formDetails.compileStatusIdentifier,
          compileStatus: y.formDetails.compileStatus,
          url: `/${y.groups[0].groupName.replaceAll(' ', '-').toLowerCase()}`
        })
    }
    return x.set(key, item)
  }, new Map()).values()]
}

module.exports = { formatAvailableForms }
