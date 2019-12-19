//************ Normalize mobile view height ************//
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
//************ Normalize mobile view height end ************//

// Receiving commands from controller to change scene
connection.on('sceneChange', function (data) {
    if (data == 0){
        transitionToView3();
    } else if (data == 1){
        transitionToView45();
    } else if (data == 2) {
        transitionToView55();
    } else if (data == 3) {
        transitionToEnding();
    }
});

// When the site is loaded, load all views but hide all of them except view1
function onLoad(){
    let sketchZero = new SceneZero();
    let sketchOne = new SceneOne();
    let sketchTwo = new SceneTwo();
    let sketchThree = new SceneThree();
    new p5(sketchZero.render, 'scenezero');
    new p5(sketchOne.render, 'sceneone');
    new p5(sketchTwo.render, 'scenetwo');
    new p5(sketchThree.render, 'scenethree');
    
    var view1 = document.getElementById("view1");
    var view2 = document.getElementById("view2");
    var selectRoom = document.getElementById("selectRoom");
    var waitingRoom = document.getElementById("waitingRoom");

    var view3 = document.getElementById("view3");
    var view4 = document.getElementById("view4");
    var view45 = document.getElementById("view45");
    var view5 = document.getElementById("view5");
    var view55 = document.getElementById("view55");
    var view6 = document.getElementById("view6");
    var ending = document.getElementById("ending");



    view2.style.display = "flex";
    selectRoom.style.display = "none";
    waitingRoom.style.display = "none";
    view3.style.display = "none";
    view4.style.display = "none";
    view45.style.display = "none";
    view5.style.display = "none";
    view55.style.display = "none";
    view6.style.display = "none";
    ending.style.display = "none";
}

function transitionToView2(){
    view1.style.display = "none";
    view2.style.display = "flex";
}

function transitionToSelectRoom(){
    view2.classList.add("fade-out");
    selectRoom.style.display = "flex";
    var delayInMilliseconds = 1000; 
    setTimeout(function() {
        view2.style.display = "none";
    }, delayInMilliseconds);
}

function transitionToWaitingRoom(){
    selectRoom.classList.remove("fade-in");
    selectRoom.classList.add("fade-out");
    waitingRoom.style.display = "flex";
    var delayInMilliseconds = 1000; 
    setTimeout(function() {
        selectRoom.style.display = "none";
    }, delayInMilliseconds);
}

function transitionToView3(){
    waitingRoom.classList.add("fade-out");
    view3.style.display = "flex";

    //hide all scenes
    selectRoom.style.display = "none";
    waitingRoom.style.display = "none";
    view45.style.display = "none";
    view5.style.display = "none";
    view55.style.display = "none";
    view6.style.display = "none";
    ending.style.display = "none";


    var delayInMilliseconds = 1000; 
    setTimeout(function() {
        selectRoom.style.display = "none";
    }, delayInMilliseconds);

    var delayInMilliseconds = 4000; //1 second
    setTimeout(function() {
        transitionToView4()
    }, delayInMilliseconds);
}

function transitionToView4(){
    view3.classList.add("fade-out");
    view4.style.display = "flex";

    var delayInMilliseconds = 1000; 
    setTimeout(function() {
        view3.style.display = "none";
    }, delayInMilliseconds);

}
function transitionToView45(){

    //hide all scenes
    selectRoom.style.display = "none";
    waitingRoom.style.display = "none";
    view3.style.display = "none";
    view55.style.display = "none";
    view6.style.display = "none";
    view2.style.display = "none";
    ending.style.display = "none ";

    view4.classList.add("fade-out-4");
    setTimeout(function(){
        view4.style.display = "none";
        view45.style.display = "flex";
    }, 1000);

    setTimeout(function(){ transitionToView5() }, 4000);
}

function transitionToView5(){
    view45.classList.add("fade-out");
    setTimeout(function(){
        view45.style.display = "none";
        view5.style.display = "flex";
        }, 1000);
}

function transitionToView55(){

    //hide all scenes
    selectRoom.style.display = "none";
    waitingRoom.style.display = "none";
    view3.style.display = "none";
    view4.style.display = "none";
    view45.style.display = "none";
    view2.style.display = "none";
    ending.style.display = "none";

    view5.classList.add("fade-out");
    setTimeout(function(){
        view5.style.display = "none";
    }, 1000);
    
    view55.style.display = "flex";

    setTimeout(function(){
         transitionToView6() 
        }, 4000);
}

function transitionToView6(){
    view55.classList.add("fade-out");
    setTimeout(function(){
        view55.style.display = "none";
        view6.style.display = "flex";

    }, 1000);
}

function transitionToEnding(){
        //hide all scenes
        selectRoom.style.display = "none";
        waitingRoom.style.display = "none";
        view3.style.display = "none";
        view4.style.display = "none";
        view45.style.display = "none";
        view5.style.display = "none";
        view55.style.display = "none";
        view2.style.display = "none";

    view6.classList.add("fade-out");
    setTimeout(function(){
        view6.style.display = "none";
        ending.style.display = "flex";
    }, 1000);



    setTimeout(function(){
        ending.classList.add("fade-out");

    }, 3000);
    setTimeout(function(){
        window.location.href = '/credit.html'

    }, 4000);


}

