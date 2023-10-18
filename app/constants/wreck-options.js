const WRECK_OPTIONS = (request) => {
  return {
    headers: {
      authorization: request.headers.authorization
    },
    rejectUnauthorized: false,
    json: true
  }
}

module.exports = { WRECK_OPTIONS }
