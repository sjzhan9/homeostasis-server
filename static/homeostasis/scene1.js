window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

//set area state
let userArea = 1;

function selectArea1() {
  //assign user to one area
  userArea = 0;
  // console.log("user selected area" + userArea);
}

function selectArea2() {
  //assign user to one area
  userArea = 1;
  // console.log("user selected area" + userArea);
}

function selectArea3() {
  //assign user to one area
  userArea = 2;
  // console.log("user selected area" + userArea);
}

// Setup connection
const connection = new Connection("Homeo", "user");
const sendInput = (section, value) => {
  connection.send("input", section, value);
};


// Lifecycle handlers

connection.on("connect", function (client) {
  console.log("I connected with id:", connection.id);
});

connection.on("disconnect", function (client) {
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
    let steps = 1080;
    let lineHeight = 10;


    setInterval(function () {
      if (waveJ == null) return;
      if (view4.style.display !== "none" || view45.style.display !== "none" || view5.style.display !== "none" || view55.style.display !== "none" || view6.style.display !== "none") {
        // console.log("sound on")
        if (waveJ.isPlaying()) {
          return;
        } else {
          waveJ.loop();
        }
      } else {
        waveJ.stop();
      }
    }, 300);

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
        });
      }

      sketch.colorMode(sketch.HSB, 360, 100, 100, 100);
      sketch.noStroke();

      lineHeight = sketch.windowHeight / steps;

    };

    sketch.draw = function () {
      sketch.background(0, 0, 0, 100);

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
      let centerIndex = sketch.int(sketch.map(tb, -90, 90, 0, steps));

      for (let i = 0; i < steps; i++) {
        let satVal = 0;
        if (i < centerIndex && i < (centerIndex - steps / 10 * 4)) {
          satVal = (centerIndex - i) * 0.2;
        } else if (i < centerIndex && i >= (centerIndex - steps / 10 * 4)) {
          satVal = (centerIndex - i) * 0.6;
        } else if (i >= centerIndex && i < (centerIndex + steps / 10 * 6)) {
          satVal = (i - centerIndex) * 0.6;
        } else {
          satVal = (i - centerIndex) * 0.2;
        }
        sketch.fill(220, 0, 70 - satVal, 100);
        sketch.rect(0, i * lineHeight, sketch.width, lineHeight);
      }

      sketch.fill(0, 100, 100);
      // sketch.text(tb, sketch.width / 2, sketch.height / 2);

      // sendMove(0, tb);

      if (sketch.frameCount % 12 == 0) {
        sendInput(userArea, tb);
        // console.log(userArea);

      }

    }

    sketch.touchStarted = function () {
      sketch.getAudioContext().resume();
    }

  }
}