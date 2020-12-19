var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
var Schema = mongoose.Schema
var faculty = new Schema({
 name:{type:String,unique: true,required:true}
})
var fucaltyModel = mongoose.model('faculty', faculty);
module.exports = fucaltyModel