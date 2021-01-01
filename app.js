const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
//const bodyParser = require('body-parser');
const { v4: uuidV4 } = require('uuid')

const app = express();

const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

//Passport config
require('./config/passport')(passport);

//DB config
require('dotenv').config(); //for setting environment variables on server
const uri = process.env.ATLAS_URI;//atlas uri stored in ATLAS_URI defined in .env
mongoose.connect(uri,{useNewUrlParser:true ,useUnifiedTopology: true})
    .then(() => console.log("mongodb connected"))
    .catch(err => console.log(err));


//peerjs server
app.use('/peerjs', peerServer);

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');
app.use(express.static('public'))

//Express Bodyparser
app.use(express.urlencoded({extended:true}));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

//Passport middleware for authentication and login
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variables to create flash messages
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.result = req.result;
    next();
});

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/class',require('./routes/class'));
app.use('/exam',require('./routes/exam'));
// app.use('/email',require('./routes/email'));


  
io.on('connection', socket => {
    console.log('new user connected');
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', userId);
      // messages
      socket.on('message', ({message,userName}) => {
        //send message to the same room
        console.log(userName);
        io.to(roomId).emit('createMessage',{message,userName})
    }); 
  
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
      })
    })
})
  


const PORT = process.env.PORT || 3000;

server.listen(PORT,console.log(`Server started on port ${PORT}`));
