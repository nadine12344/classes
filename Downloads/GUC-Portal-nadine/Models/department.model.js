var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);


var Schema = mongoose.Schema

var departement = new Schema({
  HOD:{type:String},
  name:{type:String,unique: true,required:true},
  faculty: {type:String},
  courseNames:[{type:String}],
  staffIds:[{type:String}]
})

var departementModel = mongoose.model('department', departement)

module.exports = departementModel