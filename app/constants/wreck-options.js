const WRECK_OPTIONS = (request, payload) => {
  return {
    headers: {
      authorization: request.headers.authorization
    },
    rejectUnauthorized: false,
    json: true,
    payload
  }
}

module.exports = { WRECK_OPTIONS }
