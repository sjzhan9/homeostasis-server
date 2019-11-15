window.oncontextmenu = function(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};



//p5

let lineHeight2 = 10;



function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);

    // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder1');

  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    document.body.addEventListener('click', function() {
      DeviceOrientationEvent.requestPermission();
      DeviceMotionEvent.requestPermission();

      getAudioContext().resume();

    });
  }

  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  lineHeight2 = windowHeight / 30;

}

function draw() {
  background(0, 0, 100, 50);

  let tb = floor(rotationX);

  let newAmp = map(abs(tb), 0, 180, 0, 1);

 

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
  
  // sendMove(0, tb);



}

function touchStarted() {
  getAudioContext().resume();
}