window.oncontextmenu = function(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};



//p5

class SceneTwo {
  constructor() {
    this.render = this.render.bind(this);
  }

  render(sketch) {

let lineHeight2 = 10;



 sketch.setup = function() {
  var canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

    // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder2');

  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    document.body.addEventListener('click', function() {
      DeviceOrientationEvent.requestPermission();
      DeviceMotionEvent.requestPermission();

      sketch.getAudioContext().resume();

    });
  }

  sketch.colorMode(sketch.HSB, 360, 100, 100, 100);
  sketch.noStroke();

  lineHeight2 = sketch.windowHeight / 30;

}

sketch.draw = function() {
  sketch.background(0, 0, 100, 50);

  let tb = sketch.floor(sketch.rotationX);

  let newAmp = sketch.map(sketch.abs(tb), 0, 180, 0, 1);

 

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
    sketch.rect(0, i * sketch.lineHeight, sketch.width, sketch.lineHeight);
  }

  sketch.fill(0, 100, 100);
  sketch.text(tb, sketch.width / 2, sketch.height / 2);
  
  // sendMove(0, tb);



}

sketch.touchStarted = function() {
  sketch.getAudioContext().resume();
}

  }
}