var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
var Schema = mongoose.Schema
var counter = new Schema({
academicCount:{type:Number,default:0},
hrCount:{type:Number,default:0},
})
var counterModel = mongoose.model('counter', counter);
module.exports = counterModel