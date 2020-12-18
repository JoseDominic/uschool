const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
//This is the main router from host

//Welcome Page
router.get('/',(req,res)=>{
    console.log(new Date());
    res.render('login')
});

//User Dashboard

//Pass in ensureAuthenticated object to all routes that need protection

router.get('/dashboard',ensureAuthenticated,(req,res) => {
    if(req.user.role === 'teacher') {
        res.render('teacher_dashboard',{ //sending the name of user along with res to access username from dashboard
            name:req.user.name
        })
    }
    else{
        res.render('student_dashboard',{ //sending the name of user along with res to access username from dashboard
            name:req.user.name
        })
    }

});


module.exports = router
