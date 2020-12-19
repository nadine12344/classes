var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);


var Schema = mongoose.Schema

var replacement = new Schema({
  academicMember:{type:String},
  slot:{type:String},
})

var replacementModel = mongoose.model('replacement', replacement)

module.exports = replacementModel