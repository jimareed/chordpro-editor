var express = require('express')
var session = require('express-session');
var bodyParser = require('body-parser')
var config = require('commander')

config
  .version(require('./package.json').version)
  .option('-f, --future', 'Will use in future')
  .parse(process.argv)

var app = express()
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

var sessionOptions = {
  secret: "secret",
  resave : true,
  saveUninitialized : true
};
app.use(session(sessionOptions));

app.use('/api/song', require('./controllers/api/song'))
app.use('/api/songdb', require('./controllers/api/songdb'))
app.use('/api/fretboard',require('./controllers/api/fretboard'))
app.use(require('./controllers/static'))

app.listen(PORT,function(){
   console.log('Server listening on', 3000)
})
