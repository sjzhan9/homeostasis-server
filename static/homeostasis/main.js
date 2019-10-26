// Asking for permision for motion sensors on iOS 13+ devices
if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    document.body.addEventListener('click', function () {
      DeviceOrientationEvent.requestPermission(); 
      DeviceMotionEvent.requestPermission(); 
    })
  }

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



// Get rid of annoying context menus in Chrome when long clicking
window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};


//P5 Section

  function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER);
  }
  
  function draw() {
    // Mimi's Tilt Code
    background(255);
    noStroke();
    fill(0);
  
    // Calculate transparency of left-right halves based on rotationZ of device
    // rotationZ gives you numbers from 0 to 360.
    let lr = floor(rotationZ);
    // Map rotation to alpha range
    let lra = map(lr, 0, 360, 255, 0)
  
    // Transparency reflects degree of rotation
    // Top Half
    fill(0, lra);
    rect(0, 0, width/2, height);
    // Bottom Half
    fill(0, 255 - lra);
    rect(width/2, 0, width/2, height);
  
    // Calculate transparency of top-down halves based on rotationX of device
    // rotationX gives you numbers from -180 to 180.
    let tb = floor(rotationX);
    // Ignore flipped over device
    tb = constrain(tb, 0, 180);
    // Map rotation to alpha range
    let tba = map(tb, 0, 120, 255, 0)
  
    // Transparency reflects degree of tilt
    // Top Half
    fill(0, tba);
    rect(0, 0, width, height / 2);
    // Bottom Half
    fill(0, 255 - tba);
    rect(0, height / 2, width, height);
  
    // Normalize lr and tb
    lr = map(lr, 0, 360, -1, 1);
    tb = map(tb, 0, 120, -1, 1);
  
    // //Only send direction of tilt (Mimo's method)
    // socket.emit('tilt', {x: lr, y: tb});
    
    //Send cordinate through connection.js
    let x = lr;
    let y = tb;
    console.log("cordinates are"+ x + y)
    sendMove(x, y);

  }
  
  
