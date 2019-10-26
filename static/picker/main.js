// Setup connection
var connection = new Connection("Picker", "user");

connection.onConnect(() => console.log("I connected with id:", connection.id));

connection.onDisconnect(() =>
    console.log("I disconnected with id:", connection.id)
);

connection.onOtherConnect(otherId =>
    console.log("Other client connected:", otherId)
);

connection.onOtherDisconnect(otherId =>
    console.log("Other client disconnected:", otherId)
);

// Sending move events

function clamp01(n) {
    return n > 1 ? 1 : n < 0 ? 0 : n;
}

function onMove(event) {
    const rect = event.target.getBoundingClientRect();

    let clientX, clientY;

    if (event.type.includes("touch")) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        if (event.type === "mousemove" && event.buttons === 0) return;
        clientX = event.clientX;
        clientY = event.clientY;
    }

    var x = clamp01((clientX - rect.left) / rect.width);
    var y = clamp01((clientY - rect.top) / rect.height);
    connection.send("move", clamp01(x), clamp01(y));
}

var touchArea = document.getElementById("touch-area");

touchArea.addEventListener("touchstart", onMove);
touchArea.addEventListener("touchmove", onMove);
touchArea.addEventListener("mousedown", onMove);
touchArea.addEventListener("mousemove", onMove);

// Sending scale events
const slider = document.getElementById("scale-slider");
const label = document.getElementById("scale-label");

slider.oninput = () => {
    connection.send("scale", slider.value);
    label.innerText = "Current Scale: " + slider.value;
};

// Populate the image side bar
const downloadingImages = [];

const imageList = document.getElementById("image-list");

const imageElements = [];

const onImageSelected = imgName => event => {
    connection.send("image_selected", imgName);
    imageElements.forEach(el => {
        if (el.name === imgName) {
            el.classList.add("selected");
        } else {
            el.classList.remove("selected");
        }
    });
    event.preventDefault();
};

// get the manifest
fetch("picker/images/manifest.txt")
    .then(response => response.text())
    .then(manifest => {
        var imageNames = manifest.split("\n");
        imageNames.forEach(name => {
            var image = new Image();
            downloadingImages.push(image);
            image.src = "picker/images/" + name;
            image.onload = () => {
                downloadingImages.splice(downloadingImages.indexOf(image), 1);
                var imageElement = document.createElement("img");
                imageElement.src = image.src;
                imageElement.className = "image";
                var clickHandler = onImageSelected(name);
                imageElement.name = name;
                imageElement.addEventListener("touchdown", clickHandler);
                imageElement.addEventListener("click", clickHandler);
                imageList.appendChild(imageElement);
                imageElements.push(imageElement);
            };
            image.onerror = err => {
                console.error("Failed to download ", name, ":", err);
                downloadingImages.splice(downloadingImages.indexOf(image), 1);
            };
        });
    })
    .catch(err => console.error("Could not fetch manifest:", err));
