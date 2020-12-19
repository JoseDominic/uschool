//import user model
//const User = require('../models/User');

const requiredClicks = 10 //total number of times that floating button will appear
let attendance = new Array(requiredClicks).fill(0) //array holding attendance values
var index = 0

const presentBtn = document.getElementById("presentBtn");
const leaveBtn = document.querySelector(".leave_meeting");
var elem = document.getElementById("animate");

presentBtn.addEventListener('click', (event) => {
    elem.style.display = 'none'
    if(index < requiredClicks) {
        attendance[index] = 1
    }
    console.log(attendance)
    index = index + 1
})

leaveBtn.addEventListener('click', (event) => {
  console.log(`Final attendance ${attendance}`);
  $.ajax({
    url: "/users/attendance",
    type: "POST",
    data: {
        'attendanceArray': attendance,
        'userName': userName,
    },
    success: function(data){
        console.log(data);
    }
});

})

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

async function start() {
    var totalBtnCount = requiredClicks
    var id = setInterval(frame, 3000); // show floating button every specified time interval
    function frame() {
      totalBtnCount= totalBtnCount - 1
      elem.style.display = 'block'
      //index++
      if (totalBtnCount == 0) { //condition to stop floating button animation if needed
        clearInterval(id);
      } else {
        let x = getRndInteger(0,window.innerWidth-100)
        let y = getRndInteger(0,window.innerHeight-100)
        elem.style.top = y + "px"; 
        elem.style.left = x + "px";
        //make floating button disappear after specified amount of time
        setTimeout(() => {
          elem.style.display = 'none'
        }, 2000); 
      }
    }
}

if(userRole == 'student'){
  start();
  setTimeout(() => {

    // var newUser = {
    //   $set:{
    //     attendance:attendance
    //   }
    // }
    // //update the attendance of the current user
    // User.updateOne({name:userName},newUser, (err) => {
    //   if(err){
    //     console.log(err);
    //   }
    //   else{
    //     console.log('attendance updated');
    //   }
    // });
  }, 20000)
}