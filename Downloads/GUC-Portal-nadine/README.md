# README #

# ########################################   ROKAYA   ######################################## #





# ########################################   HAGAR   ######################################## #

Functionality: make an academic member Instructor Route: /HOD/makeInstructor Request type: POST Request body: { "academicID" : "ac-1", "courseName":"CSEN704"} Response: Messages describing the status of the request like "you are not HOD : NOT AUTHORIZED" "Academic Id doesn't exist" "Course Name doesn't exist" "Academic is not in your department" "Course is not under your department" "instructor added"

Functionality: delete INstructor Route:/HOD/deleteInstructor Request type:POST Request body: { "academicID" : "ac-1", "courseName":"CSEN704"} Response:"you are not HOD : NOT AUTHORIZED" "Academic Id doesn't exist" "Course Name doesn't exist" "Academic is not in your department" "Course is not under your department" "instructor removed"

Functionality:updates instructor Route:/HOD/updateInstructor Request type:POST Request body: { "academicID" : "ac-1", "courseOld":"CSEN704","courseNew":"CSEN201"} Response:"Academic Id doesn't exist" "Old Course Name doesn't exist" "New Course Name doesn't exist" "Old Course is not under your department" "New Course is not under your department" "instructor updated"

Functionality:view staff by department Route:/HOD/viewStaffByDepartment Request type:GET Request body: NOTHING Response: array of academics in department like {id:"ac-1",name:"fjhsfkh",department:"CSEN"}

Functionality:view staff by course name Route:/HOD/viewStaffByCourseName Request type:POST Request body: {"courseName":"CSEN7777"} Response: array of academics in department and giving course like {id:"ac-1",name:"fjhsfkh",department:"CSEN"}

Functionality:view days off in department Route:/HOD/viewDaysOffInDepartment Request type:GET Request body: NOTHING Response:array of days off in department like ["Saturday","Monday"]

Functionality:view Change DayOff Requests in department Route:/HOD/viewChangeDayOffRequests Request type:GET Request body: NOTHING Response:array of change day off requests like [{from:"ac-1",to:"ac-2",type:"change day off", status:"rejected"}]

Functionality:view Leave Requests in department Route:/HOD/viewLeaveRequests Request type:GET Request body: NOTHING Response:array of leave requests like [{from:"ac-1",to:"ac-2",type:"change day off", status:"maternal leave"}]

Functionality: reject request in department Route:/HOD/rejectRequest Request type:POST Request body: {"_id":"509835737829859028vjnbf"} Response:message like "academic is not in your department" "request rejected successfully"

Functionality: accept request in department Route:/HOD/acceptRequest Request type:POST Request body: {"_id":"509835737829859028vjnbf"} Response:message like "academic is not in your department" "Leave Request Accepted" "Change Day off request accepted"

Functionality:get course coverages of courses in department Route:/HOD/courseCoverage Request type:GET Request body: NOTHING Response:array like [{Course: "CSEN7000", Coverage: ""66.4%}]

Functionality:get all teaching slots assigned to course Route:/HOD/teachingAssignmentsOfCourse Request type:POST Request body: {"courseName":"CSEN909"} Response:[{day:" saturday",academicMember:"ac-1",course:"CSEn66",order:"FIRST",..}]

Functionality:get course coverages of courses I am instructor for Route:/courseInstructor/courseCoverage Request type:GET Request body: NOTHING Response:array like [{Course: "CSEN7000", Coverage: ""66.4%}]

Functionality:get all teaching slots assigned to courses I am instructor for Route:/courseInstructor/slotsAssignment Request type:GET Request body: NOTHING Response:[{day:" saturday",academicMember:"ac-1",course:"CSEn66",order:"FIRST",..}]

Functionality:view staff in my department Route:/courseInstructor/viewStaffByDep Request type:GET Request body: NOTHING Response: array of academics in department like {id:"ac-1",name:"fjhsfkh",department:"CSEN"}

Functionality:view staff teaching at least one course of those I am instructor for Route:/courseInstructor/viewStaffByCourse Request type:GET Request body: {"courseName":"CSEN7777"} Response: array of academics in department and giving course like {id:"ac-1",name:"fjhsfkh",department:"CSEN"}

Functionality:assign a slot of a course I am instructing to an academic member that teaches it Route:/courseInstructor/assignSlotToMember Request type:POST Request body: {"_id":"5789899259729b","academicID":"ac-1"} Response:Messages like "wrong academic id" "YOU or academic member don't teach the course" "slot assigned successfully"

Functionality:change the course given in a slot to another course Route:/courseInstructor/updateSlotAssignmentToMember Request type:POST Request body: {"_id":"59458","academicID":"ac-1","courseName":"CSEN797"} Response: Messages like "wrong slot _id" "you are not an instructor for the course given in this slot" "you are not an instructor for the New course" "academic doesn't teach the new course" "The slot is not Assigned to the academic member inserted" "Assigned same slot to same Member but with new course successfully"

Functionality:delete the assignment of certain slot from certian member Route:/courseInstructor/deleteSlotAssignmentFromMember Request type:POST Request body:{"_id":"59458","academicID":"ac-1"} Response: messages like "wrong slot _id" "you are not an instructor for the course given in this slot" "The slot is not Assigned to the academic member inserted" "slot assignment deleted successfully"

Functionality:make a certain member a coordinator for a course i'm instructor for and the member teaches Route:/courseInstructor/makeCoordinator Request type:POST Request body: {"academicID":"ac-1","courseName":"CSEN555"} Response: messages like "you are not instructor for this course" "the academic doesn't teach this course" "the academic is already a coordinator for the course" "Made coordinator successfullly"

Functionality:assign a course I am instructor for to a member Route:/courseInstructor/assignAcademicToCourse Request type:POST Request body: {"academicID":"ac-1","courseName":"CSEN555"} Response: messages like "you are not instructor for this course" "the academic already assigned to this course" "Academic member doesn't work under either departments that teach the course" "academic assigned Successfully"

Route:/courseInstructor/removeAcademicFromCourse Request type:POST Request body: {"academicID":"ac-1","courseName":"CSEN555"} Response: messages like "you are not instructor for this course" "the academic doesn't teach this course" "all Academic assignments to this Course are removed successfully"




# ########################################   NADINE   ######################################## #





# ########################################   MARIAM   ######################################## #






