const koa = require("koa");
const helmet = require("koa-helmet");
const serve = require("koa-static");
const fs = require('fs');

// APP SETUP
const app = new koa();
app.use(helmet());
app.use(serve("static"));
// const server = require("https").createServer({
//     key: fs.readFileSync('../server-key.pem'),
//     cert: fs.readFileSync('../server-cert.pem')
// }, app.callback());


const server =require('http').createServer(app.callback());

// SOCKETS
const io = require("socket.io")(server);
io.origins("*:*");
const namespace = io.of("/");
const rooms = namespace.adapter.rooms;

const bodyParser = require('body-parser');
const express = require('express');
const expressApp = express();
// const webServer = require("https").Server({
//     key: fs.readFileSync('../server-key.pem'),
//     cert: fs.readFileSync('../server-cert.pem')
// }, expressApp);

const webServer = require('http').Server(expressApp);
const webIo = require("socket.io")(webServer);
let webPort = 8080;


webServer.listen(webPort, () => console.log('listening on port ' + webPort));

expressApp.set('views', __dirname + "/static/homeostasis");
expressApp.engine('.html', require('ejs').__express);
expressApp.set("view engine", "html");
expressApp.use(express.static(__dirname + "/static/homeostasis"));

expressApp.use(bodyParser.json());

let move1 = [0];
let move2 = [0];
let move3 = [0];

webIo.on("connection", function(socket){
   console.log('socket connected');

   socket.on('test', function(data){
       console.log("in test, received " + data);
   });

   socket.on("changeScene", function(data){
        console.log("change scene to " + data);

        socket.broadcast.emit('sceneChange', data);
   });

   socket.on("move1", function(data){
        // console.log("received " + data.x + " and " + data.y);

       if(move1.length > 10){
           move1.shift();
       }
        move1.push(data.y);
    });

    socket.on("move2", function(data){
        // console.log("received " + data.x + " and " + data.y);
        if(move2.length > 10){
            move2.shift();
        }
        // move2.shift();
        move2.push(data.y);
    });

    socket.on("move3", function(data){
        // console.log("received " + data.x + " and " + data.y);
        if(move3.length > 10){
            move3.shift();
        }
        // move3.shift();
        move3.push(data.y);
    });
});


//Room Section Set Up


// const routeMessages = socket => (packet, next) => {
//     // console.log("incoming");
//     const message = packet.shift();
//     if (typeof message !== "string") {
//         console.error(
//             "Received packet with invalid message type. Messages must be strings.",
//             "\n",
//             packet
//         );
//         return;
//     }
//     const room = packet.shift();
//     if (rooms[room] === undefined) {
//         console.warn(
//             "Received packet for non-existent room:",
//             room,
//             "\n",
//             packet
//         );
//         return;
//     }
//
//
//     const y = packet.pop();
//     // console.log(room);
//
//
//     if (message == "move1"){
//
//         move1.shift();
//         move1.push(y);
//     }
//
//     next();
// };


/////////// mattia's code//////////// 
const routeMessages = socket => (packet, next) => {
    const message = packet.shift();
    if (typeof message !== "string") {
        console.error(
            "Received packet with invalid message type. Messages must be strings.",
            "\n",
            packet
        );
        return;
    }

    const room = packet.shift();
    if (rooms[room] === undefined) {
        console.warn(
            "Received packet for non-existent room:",
            room,
            "\n",
            packet
        );
        return;
    }

    // console.log("routing messages from " + message + ": " + packet);

    // if (typeof y !== "float") {
    //     console.error(
    //         "Received packet with invalid message type. Y must be floats.",
    //         "\n",
    //         packet
    //     );
    //     return;
    // }
    //average y value;

    socket.broadcast.to(room).emit(message, socket.id, ...packet);
    next();
};

let port = 5000;

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

    //console.log("socket connection attempted: 5000");

    if (query === undefined) {
        console.warn("Socket tried to connect without query");
        return;
    }

    if (query.room === undefined) {

        console.log(query);

        console.warn("Socket tried to connect without specifying a room");
        return;

    }
    socket.room = query.room;

    if (query.type === undefined) {
        console.warn("Socket tried to connect without type");
        return;
    }
    socket.type = query.type;

    // Join the room...
    socket.join(socket.room);

    socket.use(routeMessages(socket));


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



// START LISTENING
server.listen(port, () => console.log('listening on port ' + port));

const ioClient = require('socket.io-client');
// const clientOne = ioClient("https://homeostasis.world:" + port, {query: {room: "Homeo", type: "user" }});
// const clientTwo = ioClient("https://homeostasis.world:" + port, {query: {room: "Homeo", type: "user" }});
// const clientThree = ioClient("https://homeostasis.world:" + port, {query: {room: "Homeo", type: "user" }});
const clientOne = ioClient("http://localhost:" + port, {query: {room: "Homeo", type: "user" }});
const clientTwo = ioClient("http://localhost:" + port, {query: {room: "Homeo", type: "user" }});
const clientThree = ioClient("http://localhost:" + port, {query: {room: "Homeo", type: "user" }});

setInterval(function(){
    // console.log("***********send avg");

   // console.log(clientOne.io);
     let avg1 = averageMove(move1);
   // console.log("avg1 is" + avg1);
   // console.log(move1);

     // socket.broadcast.to("Homeo").emit("move1output", 1, 0, avg1);
     // socket.emit("move1output",'user no.' + move1.length + 'and avg is' + avg1);
     clientOne.emit("move1", "Homeo", 0, avg1);
 
   // console.log("emited")
 
     let avg2 = averageMove(move2);
    clientTwo.emit("move2", "Homeo", 0, avg2);

    //  console.log("avg2 is" + avg2);
     // io.broadcast.to("Homeo").emit("move2", 2, 0, avg2);
 
     let avg3 = averageMove(move3);
    clientThree.emit("move3", "Homeo", 0, avg3);

    //  console.log("avg3 is" + avg3);
     // io.broadcast.to("Homeo").emit("move3", 3, 0, avg3);
 
  }, 100);

//average total of move1,2,3
function averageMove(move){

    let total = 0;
    for (i in move){
        // console.log(move);
        total = total+move[i];
    }
    let avg = total / move.length;

    return parseInt(avg);
}