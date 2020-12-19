var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);

var Schema = mongoose.Schema

var notification = new Schema({
  academicMember:{type:String},
  request:{type:String},
})

var notificationModel = mongoose.model('notification', notification)

module.exports = notificationModel