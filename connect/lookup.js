
require('anvil-connect')
var User = require('anvil-connect/models/User')

var args = process.argv
var cardid = args[2]
console.log(cardid)

User.lookup({
  params: {
    provider: 'card'
  }
},
{ id: cardid },
function (err, user) {
  if (err) {
    console.error(err)
  } else {
    console.log(user)
  }
  process.exit()
})