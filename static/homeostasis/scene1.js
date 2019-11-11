window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  // Setup connection
const connection = new Connection("Bouncer", "user");

// Messages
const sendMove = (x, y) => {
    connection.send("move", x, y);
};

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
    if (type === "app") {
    }
});


//p5
  
  let waveJ;
  let amp = 0;
  let lineHeight = 10;
  
  function preload() {
    waveJ = loadSound("/homeostasis/assets/wave.mp3");
  }
  
  function setup() {
    var canvas = createCanvas(300, 500);

      // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');
  
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.body.addEventListener('click', function() {
        DeviceOrientationEvent.requestPermission();
        DeviceMotionEvent.requestPermission();
  
        getAudioContext().resume();
  
        waveJ.loop();
      });
    }
  
    colorMode(HSB, 360, 100, 100, 100);
    noStroke();
  
    lineHeight = windowHeight / 10;
  
  }
  
  function draw() {
    background(0, 0, 100, 50);
  
    let tb = floor(rotationX);
  
    let newAmp = map(abs(tb), 0, 180, 0, 1);
  
    if (waveJ.isLoaded()) {
      fill(255);
      amp = lerp(amp, newAmp, 0.05);
      waveJ.setVolume(amp);
    }
  
    if (tb < -90) {
      tb = -90;
    }
  
    if (tb > 90) {
      tb = 90;
    }
  
    // between -90 and 90
    let centerIndex = int(map(tb, -90, 90, 0, 10));
  
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
      fill(220, satVal, 100, 80);
      rect(0, i * lineHeight, width, lineHeight);
    }
  
    fill(0, 100, 100);
    text(tb, width / 2, height / 2);
    
    sendMove(0, tb);

    if(frameCount % 12 == 0){
      sendMove(0, tb);
  }    
  }
  
  function touchStarted() {
    getAudioContext().resume();
  }