


function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);

    
      // Move the canvas so it’s inside our <div id="sketch-holder">.
      canvas.parent('sketch-holder1');
    
     
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    document.body.addEventListener('click', function() {
      DeviceOrientationEvent.requestPermission();
      DeviceMotionEvent.requestPermission();
    });
  }

  noStroke();


}

function draw() {
  background(230, 230, 230);

  let tb = float(rotationX);

  let lr = float(rotationY);


  if (tb < -90) {
    tb = -90;
  }

  if (tb > 90) {
    tb = 90;
  }

    if (lr < -90) {
    tb = -90;
  }

  if (lr > 90) {
    tb = 90;
  }


  fill(0);
  ellipse(width / 2 + lr*5, height / 2 + tb*5, 60);


}