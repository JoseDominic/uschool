//const socket = io('https://video-sock-server.herokuapp.com/')
const socket = io('/')
console.log(socket);
const roomIdView = document.getElementById('roomid')
roomIdView.innerHTML = ROOM_ID
const videoGrid = document.getElementById('video-grid')

const myPeer = new Peer(undefined, {
  host: '/',
  path:'peerjs',
  port: '443',
  debug: 3,
  config: {
    'iceServers': [
        { iceTransportPolicy:"relay",
          urls: 'stun:stun1.l.google.com:19302' },
        {
            iceTransportPolicy:"relay",
            urls: 'turn:20.198.6.107:3478?transport=tcp',
            credential: '1234',
            username: 'caleum'
        }
    ]
  }
})



// config: {‘iceServers’: [
//   { url: ‘stun:[your stun id]:[port]’ },
//   { url: 'turn:turn:numb.viagenie.ca:3478',username:'webrtc@live.com', credential: 'muazkh' }
//   ]}

let myVideoStream, myVideoStream2;
let peerConnection;

const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}

//fetch user video stream
navigator.mediaDevices.getUserMedia({
  video: {width:426,height:240},
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  // input value for text chat
  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      var message = text.val();
      //console.log(userName)
      socket.emit('message',{message,userName});
      text.val('')
    }
  });
  socket.on("createMessage", ({message, userName})=> {
    console.log(userName);
    $("ul").append(`<li class="message"><b>${userName}</b><br/>${message}</li>`);
    scrollToBottom()
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
  peerConnection = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}



//internet connectivity monitoring
//fetch fake data from api to check for internet
const checkOnlineStatus = async () => {
  try {
    // const online = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const online = await fetch('/pixel.png');
    console.log(online);
    return online.status >= 200 && online.status < 300; // either true or false
  } catch (err) {
    return false; // definitely offline
  }
};

setInterval(async () => {
  const result = await checkOnlineStatus();
  if(!result){
    alert('You are offline!!Check your connection');
  }
  const statusDisplay = document.getElementById("status");
  statusDisplay.textContent = result ? "Online" : "OFFline";
}, 3000); // check net every t seconds


const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  //console.log('object')
  //console.log(myVideoStream.getVideoTracks());
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

//Screen sharing function

const shareScreen = async () => {

  const socket = io('https://video-sock-server.herokuapp.com/')
  const videoGrid = document.getElementById('video-grid')
  const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443',
    debug: 3,
    config: {
      'iceServers': [
          { iceTransportPolicy:"relay",
            urls: 'stun:stun1.l.google.com:19302' },
          {
              iceTransportPolicy:"relay",
              urls: 'turn:20.198.6.107:3478?transport=tcp',
              credential: '1234',
              username: 'caleum'
          }
      ]
    }
  })
  
  const myVideo2 = document.createElement('video')
  myVideo2.muted = true;
  const peers = {}
  navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
  }).then(stream => {
    myVideoStream2 = stream;
    addVideoStream(myVideo2, stream)
    myPeer.on('call', call => {
      call.answer(stream)
      const video2 = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video2, userVideoStream)
      })
    })

    socket.on('user-connected', userId => {
      connectToNewUser(userId, stream)
    })
    

  })

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  
  const call = myPeer.call(userId, stream)
  const video2 = document.createElement('video')
  call.on('stream', userVideoStream => {
    
  })
  call.on('close', () => {
    video2.remove()
  })

  peers[userId] = call
}

function addVideoStream(video2, stream) {
  video2.srcObject = stream
  video2.addEventListener('loadedmetadata', () => {
    video2.play()
  })
  videoGrid.append(video2)
}


};
