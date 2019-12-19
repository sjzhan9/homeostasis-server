const koa = require("koa");
const helmet = require("koa-helmet");
const serve = require("koa-static");
const fs = require('fs');

// APP SETUP
const app = new koa();
app.use(helmet());
app.use(serve("static/homeostasis"));
const server = require("http").createServer(app.callback());

// const server = require("https").createServer({
//     key: fs.readFileSync('../server-key.pem'),
//     cert: fs.readFileSync('../server-cert.pem')
// }, app.callback());

// SOCKETS
const io = require("socket.io")(server);
io.origins("*:*");
const namespace = io.of("/");
const rooms = namespace.adapter.rooms;
// FOR SJ: Define the sections and max moves per section
const numSections = 3;
const inputsPerSection = 10;
const sections = [];
for (let i = 0; i < numSections; i++) sections.push([]);
// FOR SJ: We're also going to listen for the game so we can send it game messages so we'll store its id here when it connects
let gameId = null;
const routeMessages = socket => (packet, next) => {
    // FOR SJ: I changed this so we no longer modify the packet since now we have other middleware that inspects it
    const message = packet[0];
    if (typeof message !== "string") {
        console.error(
            "Received packet with invalid message type. Messages must be strings.",
            "\n",
            packet
        );
        return;
    }
    const room = packet[1];
    if (rooms[room] === undefined) {

        if(typeof packet[1] === "number"){
            socket.broadcast.emit('sceneChange', packet[1]);
        }else{
            console.warn(
                "Received packet for non-existent room:",
                room,
                "\n",
                packet
            );
            return;
        }

    }
    socket.broadcast.to(room).emit(message, socket.id, ...packet.slice(2));
    next();
};
// FOR SJ: Create Socket IO middleware to do something special on the input
const handleInput = socket => (packet, next) => {
    // NOTE: This assumes that you don't have "move1", "move2", etc. messages.
    // In this version you would send messages like this: connection.send("input", <A room Index (i.e. 0, 1, 2)>, <A value> )
    if (packet[0] === "input") {
        const sectionIndex = packet[2];
        if (sectionIndex < 0 || sectionIndex >= numSections) {
            console.log(`ERROR: Received a move for an invalid section ${sectionIndex}`)
            return;
        }
        const section = sections[sectionIndex];
        if (section.length > inputsPerSection) section.shift();
        const value = packet[3];
        section.push(value);
    }
    next();
};
const handleDisconnect = socket => reason => {
    console.log(
        `DISCONNECTING FROM ${socket.room}: ${socket.type} (${socket.id}). Reason: ${reason}`
    );
    socket.broadcast
        .to(socket.room)
        .emit("__client_disconnected__", socket.id, socket.type);
};
io.on("connection", socket => {
    const query = socket.handshake.query;
    if (query === undefined) {
        console.warn("Socket tried to connect without query");
        return;
    }
    if (query.room === undefined) {
        console.warn("Socket tried to connect without specifying a room");
        return;
    }
    socket.room = query.room;
    if (query.type === undefined) {
        console.warn("Socket tried to connect without type");
        return;
    }
    socket.type = query.type;
    // FOR SJ: If the connection is the game let's keep track of it so we can send it move messages
    if (socket.type === 'game') {
        gameId = socket.id;
    }
    // Join the room...
    socket.join(socket.room);

    socket.on("changeScene", function(data){
        console.log("change scene to " + data);
        socket.broadcast.emit('sceneChange', data);
   });

    socket.use(routeMessages(socket));
    // FOR SJ: We add the new middleware for the move handling
    socket.use(handleInput(socket));


    // let the connecting client know about everyone else in the room
    if (rooms[socket.room] !== undefined) {
        const roomSockets = rooms[socket.room].sockets;
        const others = [];
        for (let otherSocketId in roomSockets) {
            if (
                otherSocketId !== socket.id &&
                roomSockets.hasOwnProperty(otherSocketId) &&
                roomSockets[otherSocketId]
            ) {
                const otherSocket = namespace.connected[otherSocketId];
                others.push({ id: otherSocket.id, type: otherSocket.type });
            }
        }
        io.in(socket.id).emit("__client_connected__", others);
    }
    // Let everyone know about the joining socket
    socket.broadcast
        .to(socket.room)
        .emit("__client_connected__", [{ id: socket.id, type: socket.type }]);
    console.log(`CONNECTING TO ${socket.room}: ${socket.type} (${socket.id})`);
    // clean up on disconnection
    socket.on("disconnecting", handleDisconnect(socket));
});
// FOR SJ: At a regular interval send the message to the game.
const sendMoveInterval = 1000;
setInterval(()=>{
    // if the game hasn't connect there's no point in handling inputs..
    // console.log("log before game connection");

    if (gameId === null) return;
    sections.forEach((section, index) => {
        if (section.length === 0) return;
        let sum = 0;
        section.forEach(input => sum += input);
        const average = sum / section.length;
        // FOR SJ: Here we send the message to the game room (i.e. the game client's id) 
        // NOTE: We'll use SERVER for the id to indicate that the server is the sender of this message
        io.to(gameId).emit("move", "SERVER", index, average);
        console.log("send data of" + index);
    });
}, sendMoveInterval);
// START LISTENING
// server.listen(process.env.PORT || 5000);

server.listen(process.env.PORT || 5000, () => console.log('listening on port ' + "5000"));