var mongoose = require('mongoose')
mongoose.connect('__mongo_connection_string__',function(){
   console.log('mongodb connected')
})
module.exports = mongoose
