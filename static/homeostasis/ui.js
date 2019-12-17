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
        transitionToView45();
    } else if (data = 1){
        // transitionToView6();
    } else if (data == 2) {
        // transitionToView7();
    }
});

// When the site is loaded, load all views but hide all of them except view1
function onLoad(){
    let sketchZero = new SceneZero();
    let sketchOne = new SceneOne();
    let sketchTwo = new SceneTwo();
    new p5(sketchZero.render, 'scenezero');
    new p5(sketchOne.render, 'sceneone');
    new p5(sketchTwo.render, 'scenetwo');
    
    var view1 = document.getElementById("view1");
    var view2 = document.getElementById("view2");
    var selectRoom = document.getElementById("selectRoom");
    var view3 = document.getElementById("view3");
    var view4 = document.getElementById("view4");
    var view45 = document.getElementById("view45");
    var view5 = document.getElementById("view5");

    view2.style.display = "flex";
    selectRoom.style.display = "none";
    view3.style.display = "none";
    view4.style.display = "none";
    view45.style.display = "none";
    view5.style.display = "none";
}

function transitionToView2(){
    view1.style.display = "none";
    view2.style.display = "flex";
}

function transitionToSelectRoom(){
    view2.style.display = "none";
    selectRoom.style.display = "flex";
}

function transitionToView3(){
    selectRoom.style.display = "none";
    view3.style.display = "flex";

    var delayInMilliseconds = 2000; //1 second
    setTimeout(function() {
        transitionToView4()
    }, delayInMilliseconds);
}

function transitionToView4(){
    view3.style.display = "none";
    view4.style.display = "flex";
}
function transitionToView45(){
    view4.style.display = "none";
    view45.style.display = "flex";
    setTimeout(function(){ transitionToView5() }, 2000);
}

function transitionToView5(){
    view45.style.display = "none";
    view5.style.display = "flex";

}
// function transitionToView6(){
//     view5.style.display = "none";
//     view6.style.display = "flex";
// }

