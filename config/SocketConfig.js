exports.init = async (app) => {
    const io = require('socket.io')(app);

    io.on('connection', (socket) => {
        console.log('connected socket - ', socket.id);
        socketRoute(io, socket);
    });
}

const _ROOMS = {};

function socketRoute(io, socket) {
    socket.on('room:enter', function (data) {
        onEnterRoom(socket, parseInt(data.roomId));
    });

    socket.on('room:leave', function (data) {
        onLeaveRoom(socket, parseInt(data.roomId));
    });

    socket.on('room:leave:all', function (data) {
        onLeaveAllRoom(socket);
    });

    socket.on('message:send', function (data) {
        onSendMessage(io, socket, data);
    });

    socket.on('disconnect', function (data) {
        onDisconnect(socket);
    });
}

function onDisconnect(socket) {
    onLeaveAllRoom(socket);
    delete _ROOMS[socket.id];
}

function onEnterRoom(socket, roomId) {
    socket.join(`room-${roomId}`);
    saveRoomInfo(socket.id, roomId);
}

function onLeaveRoom(socket, roomId) {
    socket.leave(`room-${roomId}`);
    deleteRoomInfo(socket.id, roomId);
}

function onLeaveAllRoom(socket) {
    const roomInfos = _ROOMS[socket.id];
    if (roomInfos == null) { return; }

    for (const roomId of roomInfos) {
        socket.leave(`room-${roomId}`);
        deleteRoomInfo(socket.id, roomId);
    }
}

function onSendMessage(io, socket, data) {
    if (!hasRoomInfo(socket.id, parseInt(data.roomId))) { return; }

    socket.to(`room-${data.roomId}`).emit('message:receive', {
        nickname: data.nickname,
        message: data.message
    });
}

function saveRoomInfo(socketId, roomId) {
   if (_ROOMS[socketId] == null) {
       _ROOMS[socketId] = [];
   }

   if (!_ROOMS[socketId].some(id => id === roomId)) {
       _ROOMS[socketId].push(roomId);
   }
}

function deleteRoomInfo(socketId, roomId) {
    if (_ROOMS[socketId] == null) { return; }

    if (_ROOMS[socketId].some(id => id === roomId)) {
        const index = _ROOMS[socketId].indexOf(roomId);
        _ROOMS[socketId].splice(index, 1);
    }
}

function hasRoomInfo(socketId, roomId) {
    if (_ROOMS[socketId] == null) { return false; }
    return _ROOMS[socketId].some(id => id === roomId);
}
