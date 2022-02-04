const express = require('express');
const socket =  require('socket.io');
const color =  require('color');
const cors =  require('cors');

const {get_Current_User, user_Disconnect, join_User} =  require('./dummyUser');

const app =  express();
const port =  process.env.SERVER_PORT||8000;

var corsOptions = {
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

//Custom Cors middleware replaced with Library
// app.use((req, res, next) => {  
//     res.header('Access-Control-Allow-Origin',"*");
//     res.header('Access-Control-Allow-Methods', "GET, POST");
//     res.header('Access-Control-Headers','Content-Type, Authorization');
//     next();
// });
console.log(port);
var server =  app.listen(port, () => {console.log(`Server is running on Port ${port}`)});

const io = socket(server);

//intializing socket IO connection
io.on('Connection', (socket) =>{
    //for new user joining room
    socket.on("joinRoom",({username, roomname})=>{
        const p_user =  join_User(socket.id, username, roomname);
        console.log(socket.id, "=id");
        socket.join(p_user.room);

        //display a welcome message to the user  who have joined room
        socket.emit('message',{
            userId: p_user.id,
            username: username,
            text: `Welcome ${p_user.username}`
        });

        //display  a joined room  message  to all other  room user except that user
        socket.broadcast.to(p_user.room).emit('message',{
            userId: p_user.id,
            username: p_user.username,
            text: `${p_user.username} has joined the chat`,
        });
    });

    //user Sending message
    socket.on('chat', (text) =>{
        //gets the room user  and message sent
        const p_user =  get_Current_User(socket.id);
        io.to(p_user.room).emit('message',{
            userId: p_user.id,
            username: p_user.username,
            text: text
        });
    });
    // when user Disconnect
    socket.on('disconnect', () => {
        //the user is deleted from array  of users and left room message displayed
        const p_user =  user_Disconnect(socket.id);
        if(p_user){
            io.to(p_user.room).emit('message',{
                userId: p_user.id,
                username: p_user.username,
                text: `${p_user.username} has left the room`,
            });
        }
    });
});


