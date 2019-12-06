window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

let avg = "no val";
let j = 0;

// Setup connection
const connection = new Connection("Homeo", "user");

// Messages
const sendMove = (x, y) => {
  connection.send("move1", x, y);
  // let data = y;
  // connection.send1("move1", data);

};

connection.on('move1output', function (data) {
  // Data comes in as whatever was sent, including objects

  console.log("Received: 'message' " + data);
  avg = data;

  const message = data.shift();
    if (typeof message !== "string") {
        console.error(
            "Received packet with invalid message type. Messages must be strings.",
            "\n",
            packet
        );
        return;
    }
    
  if (data !== null){
    // data.shift();
    // data.shift();
    // data.shift();
    avg = data[0];
  } else {
    avg = "can not get";
  }
});



// Lifecycle handlers
connection.onConnect(() => console.log("I connected with id:", connection.id));

connection.onDisconnect(() => {
  console.log("I disconnected with id:", connection.id);
});

connection.onOtherConnect((otherId, type) => {
  console.log(type, "connected:", otherId);
});

connection.onOtherDisconnect((otherId, type) => {
  console.log(type, "disconnected:", otherId);
  if (type === "app") {}
});


//p5

class SceneTwo {
  constructor() {
    this.render = this.render.bind(this);
  }

  render(sketch) {


    let waveJ;
    let amp = 0;
    let lineHeight = 10;

    sketch.preload = function () {
      waveJ = sketch.loadSound("/homeostasis/assets/wave.mp3");
    }

    sketch.setup = function () {
      var canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
      canvas.id("scene1");


      // Move the canvas so it’s inside our <div id="sketch-holder">.
      canvas.parent('sketch-holder2');

      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        document.body.addEventListener('click', function () {
          DeviceOrientationEvent.requestPermission();
          DeviceMotionEvent.requestPermission();

          getAudioContext().resume();

          waveJ.loop();
          console.log("playing wave!")
        });
      }

      sketch.colorMode(sketch.HSB, 360, 100, 100, 100);
      sketch.noStroke();

      lineHeight = sketch.windowHeight / 10;

    }

    sketch.draw = function () {
      sketch.background(0, 0, 100, 50);

      // sendMove(0, j);
      // j++;


      sketch.text('avg is: ' + avg, 10,10);

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