const express = require('express')
const bodyParser = require('body-parser')
const {verify}= require('./api/auth/verifyToken')
const schedule=require('./api/routers/schedule.router')
const request = require('./api/routers/requests.router')
const HOD = require('./api/routers/HOD.router')
const courseInstructor = require('./api/routers/courseInstructor.router')
const scheduleModel=require('./Models/schedule.model')
const academicMemberModel=require('./Models/academicMember.model')
const slotsModel=require('./Models/slots.model')
const courseModel=require('./Models/course.model')
const departementModel=require('./Models/department.model')
const requestsModel = require('./Models/requests.model');
const {
  requestStatus,
  requestType
} = require('./api/enums');
const app = express();
const { connectDB } = require('./config/dbConfig')
const schedulemodel = require('./Models/schedule.model')
const locationModel = require('./Models/location.model')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
connectDB();
app.use(verify)
app.use('/schedule',schedule)
app.use('/request', request)
app.use('/HOD', HOD)
app.use('/courseInstructor', courseInstructor);

// var a=new academicMemberModel({
//   id:"m6",
//   name:"rok",
//   department:"5fd54e9adf4bfa099808bd12",
//   gender:"female"

// })
// a.save()


///.save()
// var a=new scheduleModel({
//   academicMember:"m3"
// })


//  a.save()





const port = 3000
if (process.env.PORT) {
  app.listen(process.env.PORT, () =>
    console.log(`Server up and running on ${process.env.PORT}`)
  )
} else {
  app.listen(port, () => console.log(`Server up and running on ${port}`))
}