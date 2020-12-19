var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


var Schema = mongoose.Schema

var leaves = new Schema({
  academicMember:{type: String },
  annualLeaveJan:{type: Number },
  annualLeaveFeb:{type: Number },
  annualLeaveMarch:{type: Number },
  annualLeaveApril:{type: Number },
  annualLeaveMay:{type: Number },
  annualLeaveJune:{type: Number },
  annualLeaveJuly:{type: Number },
  annualLeaveAug:{type: Number },
  annualLeaveSep:{type: Number },
  annualLeaveOct:{type: Number },
  annualLeaveNov:{type: Number },
  annualLeaveDec:{type: Number },
  AccidentalLeave:{type: Number },
  Compensation:{type:Number},
  

  

})

var leaveModel = mongoose.model('leaves', leaves)

module.exports = leaveModel