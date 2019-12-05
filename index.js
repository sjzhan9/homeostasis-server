const koa = require("koa");
const helmet = require("koa-helmet");
const serve = require("koa-static");

// APP SETUP
const app = new koa();
app.use(helmet());
app.use(serve("static"));
const server = require("http").createServer(app.callback());

// SOCKETS
const io = require("socket.io")(server);
io.origins("*:*");
const namespace = io.of("/");
const rooms = namespace.adapter.rooms;

//Room Section Set Up
let move1 = [];
let move2 = [];
let move3 = [];


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
    // const x = packet.shift();
    // if (typeof message !== "float") {
    //     console.error(
    //         "Received packet with invalid message type. X must be floats.",
    //         "\n",
    //         packet
    //     );
    //     return;
    // }

    const y = packet.pop();
    if (typeof message !== "float") {
        console.error(
            "Received packet with invalid message type. Y must be floats.",
            "\n",
            packet
        );
        return;
    }
    //average y value;
        move1.shift();

    move1.push(y);

            // send averaged move 1 
    let newY = averageMove(move1);
    packet.pop(newY);

    socket.broadcast.to("output").emit(message, socket.id, ...packet);
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

    //////////////////sj dec5 2019//////////////////////
    //trying to prcess data coming in from clients
    // socket.on('move1', function (data) {
    //     console.log('move1 data is: ' + data);
    //     let newData = data[6];
    //     // move1.push(data);
    //     // move1.shift();
    //     //       //send averaged move 1 
    //     // let avg = averageMove(move1);
    //     socket.emit('move1output', newData)
    //   });

    //   socket.on('move2', function (data) {
    //     console.log('move2 data is: ' + data);
    //     move2.push(data);
    //     move2.shift();
    //           //send averaged move 1 
    //     let avg = averageMove(move2);
    //     socket.emit('move2output', avg)
    //   });

    //   socket.on('move3', function (data) {
    //     console.log('move3 data is: ' + data);
    //     move3.push(data);
    //     move3.shift();
    //           //send averaged move 1 
    //     let avg = averageMove(move3);
    //     socket.emit('move3output', avg)
    //   });


    //////////////////sj dec5 2019 END//////////////////////

    // clean up on disconnection
    socket.on("disconnecting", handleDisconnect(socket));
});

// START LISTENING
server.listen(process.env.PORT || 5000);



//average total of move1,2,3
function averageMove(move){
    let total = 0;
    for (i in move){
        total = total+move[i];
    }
    let avg = total / move.length;
    return avg;
}

