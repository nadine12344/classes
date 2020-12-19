const express = require('express')
const academicMemberModel = require('../../Models/academicMember.model')
const replacementModel = require('../../Models/replacements.model')
const router = express.Router()
const scheduleModel = require('../../Models/schedule.model')
const slotsModel = require('../../Models/slots.model')



router.get('/viewSchedule',
async (req, res) => {
    try {
      var x=new slotsModel({
        location: "c6",
        order:"3rd",
        academicMember:"m3",
        day:"m",
        course:"csssssssssss"
        })
        x.save()
      //   var b=new academicMemberModel({
      //     id:"m2",
      //     name:"lalalalalalalla"
      //   })
      //   b.save()
      //   var c=new scheduleModel({
      //          academicMember:"m2"
      //   })
      //   c.save()
         await scheduleModel.findOneAndUpdate({academicMember:req.id},{$push:{slots:x}})

      var x=new replacementModel({
        academicMember:"m3",
        slot:"5fdc8a217431d5129491b56e"
      })

      x.save()

      var x=new replacementModel({
        academicMember:"m3",
        slot:"5fdc4def4b651e07e82f268e"
      })

      x.save()


     
       const schedule = await scheduleModel.find({ academicMember:req.id})
       const replacements=await replacementModel.find({academicMember:req.id})

        if(!schedule || schedule.length===0){
            return res.json({
                error: 'You donnot have a schedule ',
              })
        }

            return res.json({
              msg:"success",
                schedule,
                replacements
            })
         
        

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }
   
  )



module.exports = router