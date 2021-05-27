const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

router.get('/',ensureAuthenticated,(req,res) => {
    res.render('ppt-view',{layout:false,user:req.user.name,role:req.user.role});
})

module.exports = router;