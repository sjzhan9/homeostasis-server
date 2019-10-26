const fs = require("fs");
const path = require("path");

const imgFileExtRegex = /\.(jpg|png)$/;

const files = fs
    .readdirSync("static/picker/images")
    .filter(fileName => fileName.match(imgFileExtRegex) !== null);

fs.writeFileSync("static/picker/images/manifest.txt", files.join("\n"));
