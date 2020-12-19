var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const { slotOrder } = require('../api/enums')

var Schema = mongoose.Schema

var slots = new Schema({
  startTime: { type: Number },
  endTime: { type: Number },
  day:{type:String},
  course:{type:String },
  location:{type:String},
  order:{type: String,
    enum: [slotOrder.FIRST,
           slotOrder.SECOND,
           slotOrder.THIRD,
           slotOrder.FOURTH,
           slotOrder.FIFTH]},
  academicMember:{type:String,
                   default: 'undefined'}         

})

var slotsModel = mongoose.model('slots', slots)

module.exports = slotsModel