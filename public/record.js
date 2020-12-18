const startRecord = document.getElementById("startRecord");
const stopRecord = document.getElementById("stopRecord");
console.log(startRecord,stopRecord);
//const video = document.querySelector("video");
let recorder, streamS, streamA, outputStream;

async function startRecording() {
  streamS = await navigator.mediaDevices.getDisplayMedia({
    video: { mediaSource: "screen" }
  });
  streamA = await navigator.mediaDevices.getUserMedia({
    audio: true
  });

  outputStream = new MediaStream();
  [streamA, streamS].forEach(function (s) {
    s.getTracks().forEach(function (t) {
      outputStream.addTrack(t);
    });
  });
  recorder = new MediaRecorder(outputStream);

  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = (e) => {
    var fName = prompt('Enter file name');
    const completeBlob = new Blob(chunks, { type: chunks[0].type });
    //video.src = URL.createObjectURL(completeBlob);
    // var url = URL.createObjectURL(completeBlob);
    // var a = document.createElement("a");
    // document.body.appendChild(a);
    // a.style = "display: none";
    // a.href = url;
    // a.download = `${fName}.mp4`;
    var fd = new FormData();
    fd.append('upl', completeBlob, `${fName}.mp4`);

    fetch('/class/save',
    {
        method: 'post',
        body: fd
    }); 
    a.click();
    window.URL.revokeObjectURL(url);
  };

  recorder.start();
}

startRecord.addEventListener("click", () => {
  startRecord.setAttribute("disabled", true);
  stopRecord.removeAttribute("disabled");

  startRecording();
});

stopRecord.addEventListener("click", () => {
  stopRecord.setAttribute("disabled", true);
  startRecord.removeAttribute("disabled");

  recorder.stop();
  outputStream.getVideoTracks()[0].stop();
});
