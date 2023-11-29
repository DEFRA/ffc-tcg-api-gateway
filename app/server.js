require('./insights').setup()
const Hapi = require('@hapi/hapi')
const AuthBearer = require('hapi-auth-bearer-token')

const createServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  await server.register(AuthBearer)
  await server.register(require('./plugins/auth'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/logging'))

  return server
}

module.exports = { createServer }
