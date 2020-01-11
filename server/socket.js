const messages = require("../controllers/messages");

function handler(socket, cb) {
    console.log('connected')
    socket.on('room', (room) => {
        console.log("user joined room", room)
        socket.join(room)
    })

    socket.on('message', ({username, text, chatId}) => {
        //save to DB
        //emit to all in room
        console.log("message arrived", text, chatId)
        // socket.in(chatId).emit('message', { username, chatId, text });
        messages.Send(username, text, chatId)
        socket.emit('general', "general message")
    })
}

module.exports = handler