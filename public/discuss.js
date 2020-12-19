const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users');

//get username and room from URL

//console.log(username,room);

//const socket = io('http://localhost:5000'); //create socket from socket.io.js module imported with script tag in chat.html
const socket = io('https://uschoolchat.azurewebsites.net/');
console.log(socket);
//update room name and user list
socket.on('roomUsers',({room,users}) => {
    console.log(users);
    updateRoom(room);
    updateUsers(users);
});

//event when a user joins a room
socket.emit('joinRoom',{username,room});

//catch messages to client socket from server socket and output to chat screen
socket.on('message',message => {
    console.log(message);
    outputMessage(message);
    //move scrollbar down as each message is outputted
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//get users message from chat form
chatForm.addEventListener('submit', (e) => {
    //prevent the form from submitting to a page
    e.preventDefault();

    //get the user message from the form i/p element msg
    const msg = e.target.elements.msg.value;
    
    //send the user message to server
    socket.emit('userMessage',msg);

    //clear the message input element and focus cursor on it again
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


//function to output a message onto the chat area
function outputMessage(message) {
    const div = document.createElement('div');
    //we create a div element with our message and add it inside the div of chat area
    div.classList.add('message');
    //our chat area div has class chat-messages
    div.innerHTML = `<p class="meta">${message.user} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector(".chat-messages").appendChild(div);
}

function updateRoom(room){
    roomName.innerHTML = room;
}

function updateUsers(users){
    //create li for each user in users and join them into a string
    userList.innerHTML = `${
        users.map(user => `<li>${user.username}</li>`).join('')
    }`
}
