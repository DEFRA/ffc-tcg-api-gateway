const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/applications'),
  require('../routes/forms'),
  require('../routes/parties')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
