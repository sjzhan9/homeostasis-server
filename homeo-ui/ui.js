

//when the site is loaded, load all views but hide all of them except view1
function onLoad(){
    var view1 = document.getElementById("view1");
    var view2 = document.getElementById("view2");
    view2.style.display = "none";
}

function transitionToView2(){
    view1.style.display = "none";
    view2.style.display = "flex";
}
function transitionToView3(){
    view2.style.display = "none";
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
// function transitionToView5(){
//     view4.style.display = "none";
//     view5.style.display = "flex";
// }
// function transitionToView6(){
//     view5.style.display = "none";
//     view6.style.display = "flex";
// }

