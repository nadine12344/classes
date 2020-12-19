var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const slotsModel=require('./slots.model');
const replacementModel=require('./replacements.model');

var Schema = mongoose.Schema

var schedule = new Schema({
  academicMember: { type: String },
  slots: [slotsModel.schema],

})

var scheduleModel = mongoose.model('schedule', schedule)

module.exports = scheduleModel