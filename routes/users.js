//Router for login

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Login page
router.get('/login',(req,res)=>res.render('login'));

//Register
router.get('/register',(req,res)=>res.render('register'));

//Registration Handling
router.post('/register',(req,res) =>{
    const { name, email, role,password, password2 } = req.body;
    console.log(role)
    let errors = [];
    //Check required fields
    if(!name || !email || !role ||!password  || !password2){
        errors.push({msg:'Please fill required fields'});
    }
    
    //check if passwords equal
    if(password !== password2){
        errors.push({msg:'Passwords do not match'});
    }

    //check password length
    if(password.length<6){
        errors.push({msg:'Password should be atleast 6 characters'});
    }

    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //Validation passed

        //check if email already exists
        User.findOne({email:email})
            .then(user => {
            if(user){
                errors.push({msg:'Email already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2,
                });
            }
            else{
                const newUser = new User({
                    name,
                    email,
                    role,
                    password,
                });
                
                //Hash password
                bcrypt.genSalt(10,(err,salt) => {
                    if(err) throw err;
                    bcrypt.hash(newUser.password,salt,(err,hash) => {
                        if(err) throw err;
                        //set password to hash
                        newUser.password = hash
                        //save user
                        newUser.save()
                            .then( user => {
                                req.flash('success_msg','Thanks for registering!You can login now');
                                res.redirect('/users/login');
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    });
                });
            }

            });
        
    }
});

//Login handling
router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login', //these routes are wrt host
        failureFlash: true,
    })(req,res,next);
});

//Logout Handling
router.get('/logout',(req,res) => {
    req.logout();
    req.flash('success_msg','You are now logged out');
    res.redirect('/users/login');
})

//attendance capture
router.post('/attendance', (req,res) => {
    console.log(req.body);
    var attendanceArray = req.body.attendanceArray;
    var attendance,count=0,attentiveness;
    attendanceArray.forEach(element => {
        count+= parseInt(element);
    });
    attentiveness = (count/attendanceArray.length)*100;
    if(attentiveness >= 50){
        attendance = true;
    }
    else{
        attendance = false;
    }
    console.log(attentiveness, attendance);
    var newUser = {
      $set:{
        attendance:attendance,
        attentiveness:attentiveness
      }
    }
    User.updateOne({name:req.body.userName},newUser, (err) => {
      if(err){
        console.log(err);
      }
      else{
        console.log('attendance updated');
      }
    });
})

module.exports = router