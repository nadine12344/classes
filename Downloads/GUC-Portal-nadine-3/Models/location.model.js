var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);

var Schema = mongoose.Schema

var locations = new Schema({
 name:{type:String,unique: true,required:true},
type: {type:String,enum:['tutorial room','lecture halls','offices']},
 capacity: {type: Number},
 officeOccupants:{type:Number,default:0}
})

var locationModel = mongoose.model('locations', locations)
module.exports = locationModel