var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);


var Schema = mongoose.Schema

var course = new Schema({
  name:{type:String,unique: true,required:true},
  department:[{type:String}],
  coordinator:{type:String},
  

})

var courseModel = mongoose.model('course', course)

module.exports = courseModel