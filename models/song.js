var db = require('../db')
var Song = db.model('Song', {
   username: { type: String, required: false },
   title: { type: String, required: false },
   artist: { type: String, required: false },
   text: { type: String, required: false }
})
module.exports = Song
