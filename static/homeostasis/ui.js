
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

//when the site is loaded, load all views but hide all of them except view1
function onLoad(){
    var view1 = document.getElementById("view1");
    var view2 = document.getElementById("view2");
    var view3 = document.getElementById("view3");
    var view4 = document.getElementById("view4");
    view2.style.display = "none";
    view3.style.display = "none";
    view4.style.display = "none";
}

function transitionToView2(){
    view1.style.display = "none";
    view2.style.display = "flex";
}

function transitionToView3(){
    view2.style.display = "none";
    view3.style.display = "flex";

    var delayInMilliseconds = 6000; //1 second
    setTimeout(function() {
        transitionToView4()
    }, delayInMilliseconds);
}

function transitionToView4(){
    view3.style.display = "none";
    view4.style.display = "flex";
}
// function transitionToView5(){
//     view4.style.display = "none";
//     view5.style.display = "flex";
// }
// function transitionToView6(){
//     view5.style.display = "none";
//     view6.style.display = "flex";
// }

