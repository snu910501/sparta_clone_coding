exports.init = async (app) => {
    const io = require('socket.io')(app);
    console.log(io);

    io.on('connection', (socket) => {
        console.log('connected socket - ', socket.id);
        socketRoute(io, socket);
    });
}

function socketRoute(io, socket) {
    socket.on('message:send', function (data) {
        onSendMessage(io, socket, data);
    });
}

function onSendMessage(io, socket, data) {
    socket.broadcast.emit('message:receive', {
        nickname: data.nickname,
        message: data.message
    });
}