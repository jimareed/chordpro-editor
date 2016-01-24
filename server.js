var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())
app.use('/api/song',require('./controllers/api/song'))
app.use('/api/fretboard',require('./controllers/api/fretboard'))
app.use(require('./controllers/static'))

app.listen(3000,function(){
   console.log('Server listening on', 3000)
})
