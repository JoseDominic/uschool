const socket = io('https://video-sock-server.herokuapp.com/')
console.log(socket);
const roomIdView = document.getElementById('roomid')
roomIdView.innerHTML = ROOM_ID
const videoGrid = document.getElementById('video-grid')
const shareScreenBtn = document.getElementById('shareScreen')

const myPeer = new Peer(undefined, {
  host: '/',
  path:'peerjs',
  port: '443' //use 443 in cloud deployment
})

//let myVideoStream;
let peerConnection;

const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}

//fetch user video stream
navigator.mediaDevices.getDisplayMedia({
  video: {width:640,height:360},
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

//function to replace video stream
function replaceStream(peerConnection, mediaStream) {
  for(sender of peerConnection.getSenders()){
      if(sender.track.kind == "audio") {
          if(mediaStream.getAudioTracks().length > 0){
              sender.replaceTrack(mediaStream.getAudioTracks()[0]);
          }
      }
      if(sender.track.kind == "video") {
          if(mediaStream.getVideoTracks().length > 0){
              sender.replaceTrack(mediaStream.getVideoTracks()[0]);
          }
      }
  }
}

//Screen Sharing
shareScreenBtn.addEventListener('click', (event) => {
    navigator.mediaDevices.getDisplayMedia({
      video:{
        height:480,
        width:640
      }
    })
    .then( (stream) => {
      const video = document.createElement('video');
      addVideoStream(video,stream);
      //replaceStream(stream);
    })
})


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
