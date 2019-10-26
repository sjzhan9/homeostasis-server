// Get elements
const scaleSlider = document.getElementById("scale-slider");
const scaleLabel = document.getElementById("scale-label");
const speedSlider = document.getElementById("speed-slider");
const speedLabel = document.getElementById("speed-label");
const messageInput = document.getElementById("message");

// Setup connection
const connection = new Connection("Bouncer", "user");

// Messages
const sendScale = () => {
    connection.send("scale", scaleSlider.value);
};

const sendSpeed = () => {
    connection.send("speed", speedSlider.value);
};

const sendMessage = () => {
    connection.send("message", messageInput.value);
};

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

// Handle messages
function onMessage() {
    sendMessage();
}
messageInput.addEventListener("input", onMessage);

// Handle touches
const touchArea = document.getElementById("touch-area");

function clamp(min, max, n) {
    return n > max ? max : n < min ? min : n;
}

function onMove(event) {
    const rect = event.target.getBoundingClientRect();

    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;

    let clientX, clientY;

    if (event.type.includes("touch")) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        if (event.type === "mousemove" && event.buttons === 0) return;
        clientX = event.clientX;
        clientY = event.clientY;
    }

    let x = clamp(-1, 1, ((clientX - centerX) / rect.width) * 2);
    let y = clamp(-1, 1, ((clientY - centerY) / rect.height) * 2);

    sendMove(x, y);
}

function onStop() {
    sendMove(0, 0);
}

touchArea.addEventListener("touchstart", onMove);
touchArea.addEventListener("touchend", onStop);
touchArea.addEventListener("touchmove", onMove);
touchArea.addEventListener("mousedown", onMove);
touchArea.addEventListener("mouseup", onStop);
touchArea.addEventListener("mousemove", onMove);

// Sending scale events
scaleSlider.oninput = () => {
    sendScale();
    scaleLabel.innerText = "Scale: " + scaleSlider.value;
};

speedSlider.oninput = () => {
    sendSpeed();
    speedLabel.innerText = "Speed: " + speedSlider.value;
};
