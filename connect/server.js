/**
 * Dependencies
 */

var cluster = require('cluster')
var os = require('os')

/**
 * Fork the process for the number of CPUs available
 */

if (cluster.isMaster) {
  var cpus = os.cpus().length
  console.log('Starting %s workers', cpus)
  for (var i = 0; i < cpus; i += 1) {
    cluster.fork()
  }

/**
 * Start the server in a worker
 */
} else {
  var User = require('anvil-connect/models/User')
  var Scope = require('anvil-connect/models/Scope')
  User.schema.department = { type: 'string' }
  User.schema.staff = { type: 'boolean' }
  User.schema.sn = { type: 'string' }
  User.schema.id = { type: 'string' }
  User.mappings.userinfo.department = 'department'
  User.mappings.userinfo.staff = 'staff'
  User.mappings.userinfo.sn = 'sn'
  User.mappings.userinfo.id = 'id'
  Scope.insert({
    name: 'rhodes',
    description: 'Rhodes domain attributes',
    restricted: false,
    attributes: {
      user: ['department', 'staff', 'sn', 'id']
    }
  }, function (err) {
    if (err) throw err
  })
  
  require('anvil-connect').start()
}

/**
 * Replace dead workers
 */

cluster.on('exit', function (worker) {
  cluster.fork()
})

/**
 * Respond to SIGTERM by gracefully terminating server
 */
process.on('SIGTERM', function () {
  process.exit()
})
