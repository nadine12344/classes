var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
var Schema = mongoose.Schema
var attendance = new Schema({
staffId:{type:String,unique: true,required:true},
signIn:[{type: Date}],
signOut:[{type: Date}]
})
var attendanceModel = mongoose.model('attendance', attendance);
module.exports = attendanceModel