window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

//set area state
let userArea = 2;

function selectArea1(){
  //assign user to one area
  userArea = 1;
  // console.log("user selected area" + userArea);
}
function selectArea2(){
  //assign user to one area
  userArea = 2;
  // console.log("user selected area" + userArea);
}
function selectArea3(){
  //assign user to one area
  userArea = 3;
  // console.log("user selected area" + userArea);
}

// Setup connection
const connection = new io();

// Messages
const sendMove = (x, y) => {
  if (userArea == 1){
    connection.emit("move1", {
      x: x,
      y: y
    });
    // console.log("sent move1 at " + x + y);

  } else if (userArea == 2){
    connection.emit("move2", {
      x: x,
      y: y
    });
    // console.log("sent move2 at " + x + y);
  } else if (userArea == 3){
    connection.emit("move3", {
      x: x,
      y: y
    });
    // console.log("sent move3 at " + x + y);
  } else {
    connection.emit("move2", {
      x: x,
      y: y
    });
    // console.log("room data incorrect, sent move2 at " + x + y);
  }

};

// Lifecycle handlers

connection.on("connect", function(client){
    console.log("I connected with id:", connection.id);
});

connection.on("disconnect", function(client){
    console.log("I disconnected with id:", connection.id);
});

//p5

class SceneOne {
  constructor() {
    this.render = this.render.bind(this);
  }

  render(sketch) {


    let waveJ;
    let amp = 0;
    let lineHeight = 10;

    sketch.preload = function () {
      waveJ = sketch.loadSound("assets/wave.mp3");
    }

    sketch.setup = function () {
      var canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
      canvas.id("scene1");


      // Move the canvas so it’s inside our <div id="sketch-holder">.
      canvas.parent('sketch-holder1');

      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        document.body.addEventListener('click', function () {
          DeviceOrientationEvent.requestPermission();
          DeviceMotionEvent.requestPermission();

          sketch.getAudioContext().resume();

          waveJ.loop();
          console.log("playing wave!")
        });
      }

      sketch.colorMode(sketch.HSB, 360, 100, 100, 100);
      sketch.noStroke();

      lineHeight = sketch.windowHeight / 10;


    };

    sketch.draw = function () {
      sketch.background(0, 0, 100, 50);

      let tb = sketch.floor(sketch.rotationX);

      let newAmp = sketch.map(sketch.abs(tb), 0, 180, 0, 1);

      if (waveJ.isLoaded()) {
        sketch.fill(255);
        amp = sketch.lerp(amp, newAmp, 0.05);
        waveJ.setVolume(amp);
      }

      if (tb < -90) {
        tb = -90;
      }

      if (tb > 90) {
        tb = 90;
      }

      // between -90 and 90
      let centerIndex = sketch.int(sketch.map(tb, -90, 90, 0, 10));

      for (let i = 0; i < 10; i++) {
        let satVal = 0;
        let blueVal = 190;
        if (i <= centerIndex) {
          satVal = (centerIndex - i) * 10;
          blueVal += (centerIndex - i) * 5;
        } else {
          satVal = (i - centerIndex) * 10;
          blueVal += (i - centerIndex) * 5;
        }
        sketch.fill(220, satVal, 100, 80);
        sketch.rect(0, i * lineHeight, sketch.width, lineHeight);
      }

      sketch.fill(0, 100, 100);
      sketch.text(tb, sketch.width / 2, sketch.height / 2);

      // sendMove(0, tb);

      if (sketch.frameCount % 12 == 0) {
        sendMove(0, tb);
      }

    }

    sketch.touchStarted = function () {
      sketch.getAudioContext().resume();
    }

  }
}