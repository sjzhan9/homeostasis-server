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
let move2 = [0];
let move3 = [0];

let newY = 5;



const routeMessages = socket => (packet, next) => {
    // console.log("incoming");
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


    const y = packet.pop();
    // console.log(room);


    if (message == "move1"){

        move1.shift();
        move1.push(y);
    }

    next();
};


/////////// mattia's code//////////// 
// const routeMessages = socket => (packet, next) => {
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


//     const y = packet.pop();
//     // if (typeof y !== "float") {
//     //     console.error(
//     //         "Received packet with invalid message type. Y must be floats.",
//     //         "\n",
//     //         packet
//     //     );
//     //     return;
//     // }
//     //average y value;
//     move1.shift();
//     move1.push(y);

//     // send averaged move 1 
//     newY = averageMove(move1);
//     packet.push(newY);

//     socket.broadcast.to(room).emit(message, socket.id, ...packet);
//     next();
// };

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
    move1.push(0);

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

    setInterval(function(){
        console.log("***********send avg"); 
        let avg1 = averageMove(move1);
        console.log("avg1 is" + avg1); 
        // socket.broadcast.to("Homeo").emit("move1output", 1, 0, avg1);
        messgage = ""
        socket.emit("move1output",'user no.' + move1.length + 'and avg is' + avg1);
        console.log("emited")
    
        let avg2 = averageMove(move2);
        console.log("avg2 is" + avg2); 
        socket.broadcast.to("Homeo").emit("move2", 2, 0, avg2);
    
        let avg3 = averageMove(move3);           
        console.log("avg3 is" + avg3); 
        socket.broadcast.to("Homeo").emit("move3", 3, 0, avg3);
    
     }, 1000);
    //trying to prcess data coming in from clients

    // socket.on('move1', function (packet) {
        
    //     console.log('move1 data is: ' + packet);
    //     packet.shift();
    //     packet.shift();
    //     const y = packet.pop();
    //     console.log("y1" + y); 

    //     move1.push(y);
    //     move1.shift();
    //   });

    //   socket.on('move2', function (packet) {
    //     console.log('move2 data is: ' + packet);
    //     packet.shift();
    //     packet.shift();

    //     let y = packet.pop();
    //     console.log("y2" + y); 

    //     move2.push(y);
    //     move2.shift();
    //   });

    //   socket.on('move3', function (packet) {
    //     console.log('move3 data is: ' + packet);
    //     packet.shift();
    //     packet.shift();

    //     let y = packet.pop();
    //     console.log("y3" + y); 
    //     move3.push(y);
    //     move3.shift();
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

