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

        let amp = 0;
        let glaciers = [];

        sketch.setup = function () {
            let canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
            canvas.id("scene2");

            // Move the canvas so it’s inside our <div id="sketch-holder">.
            canvas.parent('sketch-holder2');

            sketch.colorMode(sketch.HSB, 360, 100, 100, 100);
            sketch.noStroke();

            let gNum = sketch.int(sketch.random(3, 5));

            for (let i = 0; i < gNum; i++) {
                glaciers.push(new Glacier(sketch, sketch.width, sketch.height));
            }

            sketch.background(0, 100, 100);
            sketch.pixelDensity(1);
        };

        sketch.draw = function () {
           sketch.background(210, 40, 80, 10);

            let tb = sketch.floor(sketch.rotationX);
            let rl = sketch.floor(sketch.rotationY);

            if (tb < -90) {
                tb = -90;
            }

            if (tb > 90) {
                tb = 90;
            }

            if(rl < -90){
              rl = -90;
            }

            if(rl > 90){
              rl = 90;
            }

            let windX = sketch.map(rl, -90, 90, -1, 1);
            let windY = sketch.map(tb, -90, 90, -1, 1);

            if(rl == 0 || tb == 0){
              windX = windY = 0;
            }

            for(let i = 0; i < glaciers.length; i++) {
                glaciers[i].addForce(sketch.createVector(windX, windY));

                let resistance = p5.Vector.mult(glaciers[i].vel, -1);
                glaciers[i].addForce(resistance.mult(0.7));
                glaciers[i].checkBoundaries();
                glaciers[i].update();
                glaciers[i].display();
            }

            if (sketch.frameCount % 12 == 0) {
                sendInput(userArea, tb);
            }

        };
    }
}

class Glacier {

    constructor(sketch, width, height) {

        this.width = width;
        this.height = height;
        this.pos = sketch.createVector(sketch.random(this.width), sketch.random(this.height));
        this.vel = sketch.createVector(0, 0);
        this.acc = sketch.createVector(0, 0);

        this.numPoints = sketch.int(sketch.random(4, 8));
        this.size = sketch.random(this.width / 10, this.width / 4);

        this.xoffsets = [];
        this.yoffsets = [];

        for (let i = 0; i < this.numPoints; i++) {
            this.xoffsets.push(sketch.random(-15, 30));
            this.yoffsets.push(sketch.random(-15, 30));
        }

        this.sketch = sketch;
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    addForce(f) {
        f.div(this.size * 0.1);
        this.acc.add(f);
    }

    checkBoundaries() {
        if (this.pos.x < -this.size) {
            this.pos.x = this.width + this.size;
            //this.vel.x = -this.vel.x;
        } else if (this.pos.x > this.width + this.size) {
            this.pos.x = -this.size;
            // this.vel.x = -this.vel.x;
        }
        if (this.pos.y < -this.size) {
            this.pos.y = this.height + this.size;
            // this.vel.y = -this.vel.y;
        } else if (this.pos.y > this.height + this.size) {
            this.pos.y = -this.size;
            // this.vel.y = -this.vel.y;
        }
    }

    display() {
        // this.sketch.fill(0, 0, 100);
        this.sketch.fill(33, 105, 146);

        this.sketch.push();
        this.sketch.translate(this.pos.x, this.pos.y);
        this.sketch.rotate(this.pos.heading());
        this.sketch.beginShape();

        for (let i = 0; i < this.numPoints; i++) {
            let xcoord = (this.size + this.xoffsets[i]) * this.sketch.cos(this.sketch.radians(360 / this.numPoints) * i);
            let ycoord = (this.size + this.yoffsets[i]) * this.sketch.sin(this.sketch.radians(360 / this.numPoints) * i);
            this.sketch.vertex(xcoord, ycoord);
        }

        this.sketch.endShape(this.sketch.CLOSE);
        this.sketch.pop();
    }

}
