var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);

const courseSchema = require('./course.model').schema;
var Schema = mongoose.Schema

var academicMember = new Schema({
  id:{type:String,unique: true,required:true},
  name:{type:String,required:true},
  email:{type:String,unique: true,required:true},
  gender:{type:String,},
  department:{type:String},
  courses:[String],
  salary:{type:Number},
  officeLocation:{type:String},
  extraInformation:{type:String},
  password:{type:String,default:"1234"},
  dayOff:{type:String,default:"Saturday"},
  role: { type: String },
  instructorFor: [String],
  coordinatorFor:[String],
  changePassword:{type:Boolean,default:true}
})

var academicMemberModel = mongoose.model('academicMember', academicMember)

module.exports = academicMemberModel