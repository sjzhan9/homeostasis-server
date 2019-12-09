window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

class SceneOne {
  constructor() {
    this.render = this.render.bind(this);
  }

  render(sketch) {
    sketch.setup = function () {
      var canvas0 = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
      canvas0.id("scene0");

      // Move the canvas so it’s inside our <div id="sketch-holder">.
      canvas0.parent('sketch-holder1');

      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        document.body.addEventListener('click', function () {
          DeviceOrientationEvent.requestPermission();
          DeviceMotionEvent.requestPermission();
        });
      }
      sketch.noStroke();
    }

    sketch.draw = function () {
      sketch.background(230, 230, 230);

      let tb = sketch.float(sketch.rotationX);
      let lr = sketch.float(sketch.rotationY);

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

      sketch.fill(0);
      sketch.ellipse(sketch.width / 2 + lr * 5, sketch.height / 2 + tb * 5, 60);
    }
  }
}