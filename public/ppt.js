//hide control btns for student
console.log(userRole);
if(userRole=='teacher'){
    console.log('role detected')
    document.getElementById('controlBtns').setAttribute("style","display:block;")
}
const socket = io('/')
var slideNo='0';
const nxtBtn = document.getElementById('nxtBtn');
const prevBtn = document.getElementById('prevBtn');
console.log(socket);
const session_id = 'specialppt'
socket.emit('join-sharing',session_id);

//on new connection
socket.on('new-student-joined',() => {
    if (userRole=='teacher'){
        socket.emit('slide-no',slideNo);
    }
})

//slide update
socket.on('updateSlide',(slideNoNew) => {
    console.log(slideNoNew);
    if(userRole=='student') {
        console.log(`received update event`)
        var pptBox = document.getElementById("pptBox");
        var newSrc = `/uploads/slides/${slideNoNew}.jpg`.toString()
        pptBox.setAttribute("src",newSrc);
    }
})
//change slide
nextBtn.addEventListener('click',(event) => {
    socket.emit('change-slide','next');
    console.log('slide change initiated');
})
prevBtn.addEventListener('click',(event) => {
    socket.emit('change-slide','prev');
    console.log('slide change initiated');
})
socket.on('nextSlide',(direction) => {
    console.log('next slide event received');
    var pptBox = document.getElementById("pptBox");
    //get current slide number from src string
    slideNo = pptBox.getAttribute("src");
    slideNo = slideNo.slice(16,);
    slideNo = slideNo.substring(0,slideNo.length-4);
    slideNo = Number(slideNo)
    //console.log(slideNo);
    if(direction=='next'){
        //increase slide number
        slideNo = (slideNo+1)%4;
        console.log(`Right ${slideNo}`);
    }
    else{
        //decrease slide number
        slideNo = (((slideNo-1)%4)+4)%4;
    }
    console.log(slideNo);
    var newSrc = `/uploads/slides/${slideNo}.jpg`.toString()
    pptBox.setAttribute("src",newSrc);
});