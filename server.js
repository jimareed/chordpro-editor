var express = require('express')
var bodyParser = require('body-parser')
var config = require('commander')

config
  .version(require('./package.json').version)
  .option('-f, --future', 'Will use in future')
  .parse(process.argv)

var app = express()
app.use(bodyParser.json())

app.use('/api/song', require('./controllers/api/song'))
app.use('/api/songdb',require('./controllers/api/songdb'))
app.use('/api/fretboard',require('./controllers/api/fretboard'))
app.use(require('./controllers/static'))

app.listen(3000,function(){
   console.log('Server listening on', 3000)
})
