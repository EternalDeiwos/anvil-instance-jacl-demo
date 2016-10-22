
require('anvil-connect')
var User = require('anvil-connect/models/User')

var args = process.argv
var anvilid = args[2]
var cardid = args[3]
console.log(anvilid, cardid)

User.patch(anvilid,
  { 
    providers: {
      card: {
        provider: 'card',
        protocol: 'SingleIdentifier',
        info: {
          id: cardid
        }
      }
    },
    lastProvider: 'card'
  },
  function (err, user) {
    if (err) {
      console.error(err)
    } else {
      console.log(user)
    }
    process.exit()
  }
)