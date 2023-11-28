const jwt = require('jsonwebtoken')

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server, _options) => {
      server.auth.strategy('simple', 'bearer-access-token', {
        allowQueryToken: true, // optional, false by default
        validate: async (request, token, h) => {
          const decoded = jwt.decode(token)
          return {
            isValid: true,
            credentials: {
              scope: decoded.roles.map(role => {
                const roleData = role.split(':')
                return roleData.length > 1 ? roleData[1] : roleData[0]
              })
            }
          }
        }
      })

      server.auth.default({ strategy: 'simple', mode: 'try' })
    }
  }
}
