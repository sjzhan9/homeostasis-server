window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

//p5

class SceneThree {

    constructor() {
        this.render = this.render.bind(this);
    }

    render(sketch) {

        let hue;
        let maxVal;

        sketch.setup = function () {
            let canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
            canvas.id("scene3");

            // Move the canvas so it’s inside our <div id="sketch-holder">.
            canvas.parent('sketch-holder3');

            sketch.colorMode(sketch.HSB, 360, 160, 100, 100);
            sketch.noStroke();

            sketch.background(0, 100, 100);
            sketch.pixelDensity(1);

            if(sketch.random() > 0.5){
                hue = sketch.int(sketch.random(300, 360));
            }else{
                hue = sketch.int(sketch.random(200, 240));
            }

            maxVal = 160;

            sketch.frameRate(30);
        };

        let sat;

        sketch.draw = function () {

            let tb = sketch.floor(sketch.rotationX);

            if (tb < -90) {
                tb = -90;
            }

            if (tb > 90) {
                tb = 90;
            }

            if(document.getElementById('view6').style.display !== "none"){
                if(sketch.frameCount % 30 == 0){
                    maxVal--;
                }
            }

            sat = sketch.map(Math.abs(tb), 0, 90, 0, maxVal);

            sketch.background(hue, sat, 100);


            if (sketch.frameCount % 12 == 0) {
                sendInput(userArea, tb);
            }

        };
    }
}
