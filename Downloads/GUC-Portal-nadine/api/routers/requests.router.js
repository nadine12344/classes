const express = require('express')
const router = express.Router()
const requestsModel = require('../../Models/requests.model')
const academicMemberModel = require('../../Models/academicMember.model')
const  slotsModel = require('../../Models/slots.model')
const courseModel=require('../../Models/course.model')
const departementModel=require('../../Models/department.model')
const locationModel=require('../../Models/location.model')
const { requestStatus,requestType } = require('../enums')
const notificationModel = require('../../Models/notification.model')
const scheduleModel=require("../../Models/schedule.model")
const leavesModel=require("../../Models/leaves.model")



router.post('/sendReplacementRequest',
  async (req, res) => {
    try {

      const reciever = req.body.to;
      const slot = req.body.slot;
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }

      if(!reciever ||reciever.length===0){
        return res.json({
          error:'please enter the replacement member you want to replace with',
         })  
      }

      if(!slot ||slot.length===0){
        return res.json({
          error:'please enter the slot id',
         })  
      }

      reciever1 = await academicMemberModel.find({
        id: reciever
      })
      sender1 = await academicMemberModel.find({
        id: req.id
      })

      slot1 = await slotsModel.find({
        _id: slot
      })

      if(slot1.length===0){
        return res.json({
          error:'this is not a valid slot id',
         })  
      }

      if(reciever1.length===0|| !reciever1){
        return res.json({
          error:'you are not sending request to a valid member',
         })  
      }
        
      senderCourses = sender1[0].courses.filter((c) => {

        if (c === slot1[0].course) {
          return slot1[0].course
        }
      })

     if(slot1[0].academicMember!=req.id){
      return res.json({
        error: 'you are not teaching this slot ',
      })
     }
      recieverCourses = reciever1[0].courses.filter((c) => {
        if (c === slot1[0].course) {
          return slot1[0].course
        }
      })
      

            if (recieverCourses.length === 0) {
            return res.json({
              error: 'You should send request to someone teaching this course ',
            })
          }

      var recieverSlots=(await scheduleModel.find({academicMember:reciever}))[0].slots
      

      recieverSlots=recieverSlots.filter((s)=>{
        if (s.day === slot1[0].day && s.order===slot1[0].order) {
          return s
        }
      })

      if(recieverSlots.length!=0){
        return res.json({
          error: 'the member you are sending to have teaching in this slot,try another free member',
        })
      }
       
            const request = new requestsModel({
              from: req.id,
              to: reciever,
              type: requestType.REPLACEMENT,
              reason: req.body.reason,
              status: requestStatus.PENDING,
              slot: slot
            })
            request.save();

            const reqq=requestsModel.find({from: req.id, to: reciever, type: requestType.REPLACEMENT,reason: req.body.reason,status: requestStatus.PENDING,slot: slot})

            var notification=new notificationModel({
              academicMember:reciever,
              request:reqq[0]._id
            })
            notification.save()
            return res.json({
              msg: 'request created successfully',
              request
            })

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)

router.get('/viewSentReplacementRequest',
  async (req, res) => {
    try {
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }
      const requests =await requestsModel.find({to: req.id})
      return res.json({
        msg: ' success',
        requests
      })
    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)


router.get('/viewRecievedReplacementRequest',
  async (req, res) => {
    try {
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }
      const requests=await requestsModel.find({from: req.id })

      return res.json({
        msg: ' success',
        requests
      })
    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }
)



router.post('/sendSlotLinkingRequest',

  async (req, res) => {
    try {
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }
        const slot=req.body.slot;
        const slot1=await slotsModel.find({_id:slot});
        const sender1= await academicMemberModel.find({id:req.id})
      if (slot1.length === 0) {
        return res.json({
          error: 'this slot does not exist',
        })
      }
      //console.log(sender1[0].courses)
      //console.log(slot1[0].course)

        senderCourses = sender1[0].courses.filter((c) => {
          if (c === slot1[0].course) {
            return c
          }
        })
        if (senderCourses.length === 0) {
          return res.json({
            error: 'you donot teach this course',
          })

         
        }
        if(slot1[0].academicMember!='undefined'){
          return res.json({
            error: 'this slot is already linked to another member',
          })       
        }

      var mySlots=(await scheduleModel.find({academicMember:req.id}))[0].slots

      mySlots=mySlots.filter((s)=>{
        if (s.day === slot1[0].day && s.order===slot1[0].order) {
          return s
        }
      })

      if(mySlots.length!=0){
        return res.json({
          error: 'you already have teaching in this time,you canot have two slots at the same time',
        })
      }


          const course = await courseModel.find({
            _id: slot1[0].course
          })
          const request = new requestsModel({
            from: req.id,
            to: course[0].coordinator,
            type: requestType.SLOT_LINKING,
            status: requestStatus.PENDING,
            slot: slot,
          })
          request.save();
          return res.json({
            msg: 'request created successfully',
            request
          })
        

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)



router.post('/sendChangeDayOffRequest',
  async (req, res) => {
    try {
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }
      const dayOff = req.body.day;
      const sender1 = await academicMemberModel.find({
        id: req.id
      })
      var mySlots=(await scheduleModel.find({academicMember:req.id}))[0].slots

      mySlots=mySlots.filter((s)=>{
        if (s.day ===dayOff) {
          return s
        }
      })

      if(mySlots.length!=0){
        return res.json({
          error: 'you already have teaching in this day you canot change day off to a day where you have teaching in',
        })
      }
      const dep = await departementModel.find({
        _id: sender1[0].department
      })

      const request = new requestsModel({
        from: req.id,
        to: dep[0].HOD,
        type: requestType.CHANGE_DAY_OFF,
        reason: req.body.reason,
        status: requestStatus.PENDING,
        dayOff: dayOff,
      })
      request.save();
      return res.json({
        msg: 'request created successfully',
        request
      })

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)



  router.post('/sendAnnualLeaveRequest',
async (req, res) => {
    try {
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }
        const reason=req.body.reason;
        const replacements=req.body.replacements
        const date=req.body.date;
        const sender1= await academicMemberModel.find({id:req.id})
        const dep=await departementModel.find({_id:sender1[0].department})

        var datereq = new Date(date);  // dateStr you get from mongodb
            
       var d = datereq.getDate();
       var m = datereq.getMonth()+1;
       var y=datereq.getFullYear()

        //console.log(y)
      //  console.log(m)

       var datetoday=new Date(Date.now())

       var d1 = datetoday.getDate();
       var m1 = datetoday.getMonth()+1;
       var y1=datereq.getFullYear()

      //  console.log(d1)
      //  console.log(m1)



        if(y1>y||(y1===y && m<m1) || (y1===y && m===m1 &&d<d1)){
          return res.json({
            error: 'annual leave should be submitted before targeted day',
          })
        }

            const request=new requestsModel({
              from:req.id,
              to:dep[0].HOD,
              type:requestType.ANNUAL_LEAVE,
              reason:reason,
              status:requestStatus.PENDING,
              replacementMembers:replacements,
              dateOfRequest:date,
            })
              request.save();
                  return res.json({
                   msg:'request created successfully',
                         request
                  })  

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }
   
  )


  router.post('/sendAccidentalLeaveRequest',
  async (req, res) => {
      try {
        if(req.role!="teachingAssistant" && req.role!="coordinator"){
          return res.json({
            error:'only a TA or an Academic coordinator can use this function',
           })  
        }
          const reason=req.body.reason;
          const date=req.body.date;
          const sender1= await academicMemberModel.find({id:req.id})
          const dep=await departementModel.find({_id:sender1[0].department})
          const leaves=await leavesModel.find({academicMember:req.id})
           
          if(leaves[0].ACCIDENTAL_LEAVE>=6){
            return res.json({
              error:'you canot send accidental leaves any more you already consumed your annual accidental leave balance',
             })  
          }
          
              const request=new requestsModel({
                from:req.id,
                to:dep[0].HOD,
                type:requestType.ACCIDENTAL_LEAVE,
                reason:reason,
                status:requestStatus.PENDING,
                dateOfRequest:date,
              })
                request.save();
                    return res.json({
                     msg:'request created successfully',
                           request
                    })  
  
      } catch (exception) {
        return res.json({
          error: 'Something went wrong',
          exception
        })
      }
    }
     
    )

    router.post('/sendSickLeaveRequest',
async (req, res) => {
    try {
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }
        const reason=req.body.reason;
        const date=req.body.date;
        const documents=req.body.documents;
        const sender1= await academicMemberModel.find({id:req.id})
        const dep=await departementModel.find({_id:sender1[0].department})


        var datereq = new Date(date);  // dateStr you get from mongodb
            
       var d = datereq.getDate();
       var m = datereq.getMonth()+1;
       var y=datereq.getFullYear()

       if((d+3)>30){
         d=(d+3)%30
          if((m+1)>12){
            m=(m+1)%12
            y++;
          }
          else{
            m=m+1;
          }
       }
       else{
         d+=3
       }


       var datetoday=new Date(Date.now())

       var d1 = datetoday.getDate();
       var m1 = datetoday.getMonth()+1;
       var y1=datereq.getFullYear()

        if(y1>y||(y1===y && m<m1) || (y1===y && m===m1 &&d<d1 )){
          return res.json({
            error: 'sick leave should be sumbitted within 3 days  of the day you were sick',
          })
        }

        if(!documents || documents.length===0 ){
          return res.json({
            error: 'you should submit necessary documents',
          })
        }

            const request=new requestsModel({
              from:req.id,
              to:dep[0].HOD,
              type:requestType.SICK_LEAVE,
              reason:reason,
              status:requestStatus.PENDING,
              dateOfRequest:date,
              documentsDriveLink:documents
            })
              request.save();
                  return res.json({
                   msg:'request created successfully',
                         request
                  })  

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }
   
  )


  router.post('/sendMaternityLeaveRequest',
async (req, res) => {
    try {
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }
        const reason=req.body.reason;
        const date=req.body.date;
        const documents=req.body.documents;
        const sender1= await academicMemberModel.find({id:req.id})
        const dep=await departementModel.find({_id:sender1[0].department})
        var datereq = new Date(date);
        var d = datereq.getDate();
        var m = datereq.getMonth()+1;
        var y=datereq.getFullYear()

          if((m+3)>12){
            m=(m+3)%12
            y++;
          }
          else{
            m=m+3;
          }
       


       var datetoday=new Date(Date.now())

       var d1 = datetoday.getDate();
       var m1 = datetoday.getMonth()+1;
       var y1=datereq.getFullYear()

        if(y1>y||(y1===y && m<m1) ){
          return res.json({
            error: 'matrenity leave should be submitted within 3 month',
          })
        }

        if(!documents || documents.length===0 ){
          return res.json({
            error: 'you should submit necessary documents to proove metrinity condition',
          })
        }

        if(sender1[0].gender!='female'){
          return res.json({
            error: 'maternity leaves should only be submitted by female staff members',
          })
        }

            const request=new requestsModel({
              from:req.id,
              to:dep[0].HOD,
              type:requestType.MATERNITY_LEAVE,
              reason:reason,
              status:requestStatus.PENDING,
              dateOfRequest:date,
            })
              request.save();
                  return res.json({
                   msg:'request created successfully',
                         request
                  })  

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }
   
  )

  router.post('/sendCompensationLeaveRequest',
async (req, res) => {
    try {
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }
        const reason=req.body.reason;
        const date=req.body.date;
        const sender1= await academicMemberModel.find({id:req.id})
        const dep=await departementModel.find({_id:sender1[0].department})

        if(!reason ||reason===''|| reason.length===0){
          return res.json({
            error: 'you should submit a reason for you compensation leave',
          })
        }

            const request=new requestsModel({
              from:req.id,
              to:dep[0].HOD,
              type:requestType.COMPENSATION_LEAVE,
              reason:reason,
              status:requestStatus.PENDING,
              dateOfRequest:date,
            })
              request.save();
                  return res.json({
                   msg:'request created successfully',
                         request
                  })  

    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)

router.get('/viewAllSubmittedRequests',
  async (req, res) => {
    try {
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }
      const requests = await requestsModel.find({
        from: req.id
      })
      if (requests.length === 0) {
        return res.json({
          error: 'you havenot submitted any requests',
        })

      } else {
        return res.json({
          msg: 'success',
          requests
        })
      }
    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)


router.get('/viewAllAcceptedRequests',
  async (req, res) => {
    try {
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }
        const sender=req.body.email;
        var requests= await requestsModel.find({from:sender})
        console.log(Date.now().getDate())
        requests=requests.filter((r)=>{
          if(r.status===requestStatus.ACCEPTED){
          return r;
        }
      })

      if (requests.length === 0) {
        return res.json({
          error: 'you donot have accepted requests',
        })

      } else {
        return res.json({
          msg: 'success',
          requests
        })
      }
    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)


router.get('/viewAllRejectedRequests',
  async (req, res) => {
    try {
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }
      const sender = req.body.email;
      var requests = await requestsModel.find({
        from: sender
      })

      requests = requests.filter((r) => {
        if (r.status === requestStatus.REJECTED) {
          return r;
        }
      })

      if (requests.length === 0) {
        return res.json({
          error: 'you donot have rejected requests',
        })

      } else {
        return res.json({
          msg: 'success',
          requests
        })
      }
    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }

)



router.get('/viewAllPendingRequests',
  async (req, res) => {
    try {
      if(req.role!="teachingAssistant" && req.role!="coordinator"){
        return res.json({
          error:'only a TA or an Academic coordinator can use this function',
         })  
      }
      const sender = req.body.email;
      var requests = await requestsModel.find({
        from: sender
      })

      requests = requests.filter((r) => {
        if (r.status === requestStatus.PENDING) {
          return r;
        }
      })

      if (requests.length === 0) {
        return res.json({
          error: 'you donot have pending requests',
        })

      } else {
        return res.json({
          msg: 'success',
          requests
        })
      }
    } catch (exception) {
      return res.json({
        error: 'Something went wrong',
        exception
      })
    }
  }
    )

    router.put('/cancelRequest',
    async (req, res) => {
      try {
        if(req.role!="teachingAssistant" && req.role!="coordinator"){
          return res.json({
            error:'only a TA or an Academic coordinator can use this function',
           })  
        }
              const request=req.body.request;
              const request1=await requestsModel.find({_id:request})
            
              if(request1.length===0){
                return res.json({
                  error: 'there is no request with this id',
                })
              }
              const reqSender=request1[0].from
              if(reqSender!=req.id){
                return res.json({
                  error: 'You Canot cancel a request not sent by you',
                })
              }


              if(request1[0].status===requestStatus.PENDING){
               request1[0].status=requestStatus.CANCELED
                await requestsModel.findByIdAndUpdate(request, {status:requestStatus.CANCELED})
                return res.json({
                  msg: 'cancelled successfully',
                  request1
                })
              }


              if(request1[0].status===requestStatus.PENDING){
                console.log("pending")
               request1[0].status=requestStatus.CANCELED
                await requestsModel.findByIdAndUpdate(request, {status:requestStatus.CANCELED})
                return res.json({
                  msg: 'cancelled successfully',
                  request1
                })
              }

                if(request1[0].dateOfRequest> Date.now()){
                  request1[0].status=requestStatus.CANCELED
                  await requestsModel.findByIdAndUpdate(request, {status:requestStatus.CANCELED})
                return res.json({
                  msg: 'cancelled successfully',
                  request1
                })
              }
              return res.json({
                error: 'you can only cancel a request which is still pending or a request whose day is yet to come',
              })

    } catch (exception) {
          return res.json({
            error: 'Something went wrong',
            exception
          })
        }
      }
       
      )


      router.post('/rejectReplacementRequest',
    async (req, res) => {
      try {
        const request=req.body.request

        const request1=await requestsModel.find({_id:request})

        if(!request1 || request1.length===0){
          return res.json({
            error:'this is not a valid request id',
           })  
        }

        if( request1[0].to!=req.id){
          return res.json({
            error:'you canot reject a request not sent to you',
           })  
        }

        await requestsModel.findByIdAndUpdate(request, {status:requestStatus.REJECTED})
        var notification=new notificationModel({
          academicMember:request1[0].from,
          request:request
        })
        notification.save()
        
                  return res.json({
                   msg:'succefully rejected request',
                  })  

                
  
    } catch (exception) {
          return res.json({
            error: 'Something went wrong',
            exception
          })
        }
      }
       
      )


      router.post('/acceptReplacementRequest',
      async (req, res) => {
        try {
          const request=req.body.request
  
          const request1=await requestsModel.find({_id:request})
  
          if(!request1 || request1.length===0){
            return res.json({
              error:'this is not a valid request id',
             })  
          }
  
          if( request1[0].to!=req.id){
            return res.json({
              error:'you canot accept a request not sent to you',
             })  
          }
  
          await requestsModel.findByIdAndUpdate(request, {status:requestStatus.ACCEPTED})
          var notification=new notificationModel({
            academicMember:request1[0].from,
            request:request
          })
          notification.save()
          
                    return res.json({
                     msg:'succefully accepted request',
                    })  
  
                  
    
      } catch (exception) {
            return res.json({
              error: 'Something went wrong',
              exception
            })
          }
        }
         
        )



////////////////////////////////////////////////////////////////COORDINATOR ROLES/////////////////////////////////////////////////////////////



router.get('/viewAllSlotLinkingRequests',
  async (req, res) => {
    try {
      const sender1=await  academicMemberModel.find({id:req.id})
      if( sender1.length===0||req.role!='coordinator'){
        return res.json({
          error:'you cannot view slot linking request as you are not a coordinator',
         })  
      }
      var requests= await requestsModel.find({to:req.id,type:requestType.SLOT_LINKING})
                return res.json({
                 msg:'success',
                       requests
                })  

  } catch (exception) {
        return res.json({
          error: 'Something went wrong',
          exception
        })
      }
    }
     
    )




  router.post('/addSlot',
  async (req, res) => {
    try {
      const startTime=req.body.startTime
      const endTime=req.body.endTime
      const day=req.body.day
      const location=req.body.location
      const order=req.body.order
      const course=req.body.course

      const loc=await  locationModel.find({_id:location})
      if(!loc || loc.length===0){
        return res.json({
          error:'this is not a valid location in the university',
         })  
      }

      const sender1=await  academicMemberModel.find({id:req.id,role:"coordinator"})

      if(sender1.length===0||req.role!='coordinator'){
        return res.json({
          error:'you cannot add slots as you are not a coordinator',
         })  
      }
     // console.log("alalal")
     
      const course1=await courseModel.find({coordinator:req.id})
      if(course1.length===0){
        return res.json({
          error:'there is no courses that you are currently coordinating ',
         })  
      }
      if(course1[0]._id!=course){
        return res.json({
          error:'you could not add a slot in a course you are not coordinating',
         })  
      }
      const courseId=course1[0]._id

      const slot=await  slotsModel.find({day:day,location:location,order:order})
      if(slot.length!=0){
        return res.json({
          error:'there is a slot in this time in this location please choose valid location or different time ',
         })  
      }




      var slot1=new slotsModel({
        startTime:startTime,
        endTime:endTime,
        day:day,
        course:courseId,
        location:location,
        order:order
      })
      slot1.save();
  
                return res.json({
                 msg:'slot added successfully',
                       slot1
                })  

  } catch (exception) {
        return res.json({
          error: 'Something went wrong',
          exception
        })
      }
    }
     
    )





  router.put('/updateSlot',
  async (req, res) => {
    try {
      const startTime=req.body.startTime
      const endTime=req.body.endTime
      const day=req.body.day
      const location=req.body.location
      const order=req.body.order
      const slotId=req.body.slot
      const academicMember=req.body.academicMember

      const slot=await slotsModel.find({_id:slotId})

      const loc=await  locationModel.find({_id:location})
      if(!loc || loc.length===0){
        return res.json({
          error:'this is not a valid location in the university',
         })  
      }

      const sender1=await  academicMemberModel.find({email:req.id,role:"coordinator"})

      if(sender1.length===0||sender1[0].role!='coordinator'){
        return res.json({
          error:'you cannot update slots as you are not a coordinator',
         })  
      }
     
      const course=await  courseModel.find({coordinator:req.id})
      if(course.length===0){
        return res.json({
          error:'there is no courses that you are currently coordinating ',
         })  
      }

      if(course[0]._id!=slot[0].course){
        return res.json({
          error:'you could not update a slot in a course you are not coordinating',
         })  
      }


      const courseId=course[0]._id
     // console.log("nannananna")

      const slot1=await slotsModel.find({day:day,location:location,order:order})
     // console.log(slot)
      if(slot1.length!=0){
        return res.json({
          error:'there is a slot in this time in this location please choose valid location or different day ',
         })  
      }
     
     await slotsModel.findByIdAndUpdate(slotId, {startTime:startTime,endTime:endTime,day:day,location:location,order:order,academicMember:academicMember})
      console.log(slot1[0])
     if(slot[0].academicMember!='undefined'){
         console.log("an agwa")
     var myUpdatedSlot=await slotsModel.find({_id:slotId})
      var allSchedules =await scheduleModel.find()   
      allSchedules=allSchedules.filter( async(s)=>{
      var sl=s.slots
      sl=sl.filter((x)=>{
        if(x._id==slotId){
        }
        else{
          return x
        }
      })
      sl.push(myUpdatedSlot[0])
     // console.log(sl)
        await scheduleModel.findOneAndUpdate({academicMember:s.academicMember},{slots:sl})
      })
    }
 
     
                return res.json({
                 msg:'slot updated successfully',
                }) 
                
            

  } catch (exception) {
        return res.json({
          error: 'Something went wrong',
          exception
        })
      }
    }
     
    )


    router.delete('/deleteSlot',
  async (req, res) => {
    try {
      const slotId=req.body.slot
      const sender1=await  academicMemberModel.find({email:req.id,role:"coordinator"})

      if(sender1.length===0||sender1[0].role!='coordinator'){
        return res.json({
          error:'you cannot delete slots as you are not a coordinator',
         })  
      }
     
      const course=await  courseModel.find({coordinator:req.id})
      if(course.length===0){
        return res.json({
          error:'there is no courses that you are currently coordinating ',
         })  
      }
      const slot=await slotsModel.find({_id:slotId})

      if(course[0]._id!=slot[0].course){
        return res.json({
          error:'you could not delete a slot in a course you are not coordinating',
         })  
      }
      if(slot[0].academicMember!='undefined'){
         var allSchedules =await scheduleModel.find()   
         allSchedules=allSchedules.filter( async(s)=>{
         var sl=s.slots
         sl=sl.filter((x)=>{
           if(x._id==slotId){
           }
           else{
             return x
           }
         })
           await scheduleModel.findOneAndUpdate({academicMember:s.academicMember},{slots:sl})
         })
       }

      await slotsModel.findByIdAndDelete(slotId)
                return res.json({
                 msg:'slot deleted successfully',
                })  

  } catch (exception) {
        return res.json({
          error: 'Something went wrong',
          exception
        })
      }
    }
     
    )

    router.post('/acceptSlotLinkingRequest',
    async (req, res) => {
      try {
        const request=req.body.request

        const request1=await requestsModel.find({_id:request})
        const sender1=await academicMemberModel.find({id:req.id,role:"coordinator"})

        if(!request1 || request1.length===0){
          return res.json({
            error:'this is not a valid request id',
           })  
        }

        if( request1[0].type!=requestType.SLOT_LINKING){
          return res.json({
            error:'this is not a slotLinking request',
           })  
        }
        //
  
        if(sender1.length===0||sender1[0].role!='coordinator'){
          return res.json({
            error:'you cannot accept slotlinking requests as you are not a coordinator',
           })  
        }
       
        const course=await  courseModel.find({coordinator:req.id})
        if(course.length===0){
          return res.json({
            error:'there is no courses that you are currently coordinating ',
           })  
        }

       // console.log(request1[0].slot)

        var slot=await slotsModel.find({_id:request1[0].slot})
        //console.log(slot)
        if(slot[0].course!=course[0]._id){
          return res.json({
            error:'you canot accept this request because it is related to a course that you are not coordinating ',
           })  
        }

        await requestsModel.findByIdAndUpdate(request, {status:requestStatus.ACCEPTED})
        slot[0].academicMember=request1[0].from
        console.log(request1[0].from)
        await scheduleModel.findOneAndUpdate({academicMember:request1[0].from},{$push:{slots:slot[0]}})
        await slotsModel.findByIdAndUpdate(slot[0]._id,{academicMember:request1[0].from})
        console.log("tata")

        var notification=new notificationModel({
          academicMember:request1[0].from,
          request:request
        })
        notification.save()
        
                  return res.json({
                   msg:'succefully accepted request',
                  })  

                
  
    } catch (exception) {
          return res.json({
            error: 'Something went wrong',
            exception
          })
        }
      }
       
      )


    router.post('/rejectSlotLinkingRequest',
    async (req, res) => {
      try {
        const request=req.body.request

        const request1=await requestsModel.find({_id:request})
        const sender1=await academicMemberModel.find({id:req.id,role:"coordinator"})

        if(!request1 || request1.length===0){
          return res.json({
            error:'this is not a valid request id',
           })  
        }

        if( request1[0].type!=requestType.SLOT_LINKING){
          return res.json({
            error:'this is not a slotLinking request',
           })  
        }
        //
  
        if(sender1.length===0||sender1[0].role!='coordinator'){
          return res.json({
            error:'you cannot reject slotlinking requests as you are not a coordinator',
           })  
        }
       
        const course=await  courseModel.find({coordinator:req.id})
        if(course.length===0){
          return res.json({
            error:'there is no courses that you are currently coordinating ',
           })  
        }

       // console.log(request1[0].slot)

        const slot=await slotsModel.find({_id:request1[0].slot})
        console.log(slot)
        if(slot[0].course!=course[0]._id){
          return res.json({
            error:'you canot reject this request because it is related to a course that you are not coordinating ',
           })  
        }
      //  console.log("alalla")

        await requestsModel.findByIdAndUpdate(request, {status:requestStatus.REJECTED})
        var notification=new notificationModel({
          academicMember:request1[0].from,
          request:request
        })
        notification.save()
        
                  return res.json({
                   msg:'succefully rejected request',
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