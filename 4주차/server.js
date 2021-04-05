const { captureRejectionSymbol } = require('events');
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = 3000;

const room = [];
const firstRoomName = 'game-';
const roomStatus = {
    waiting : 0,
    playing : 1,
    over : 2
}

let UnEnterable = true;

var router = require('./router/main') (app);

app.use(express.static('public'));

// server에 연결 중
var bingoRoom = io.of('/bingo').on('connection', function(socket){
    console.log("User join");

    let user_cookie = socket.handshake.headers.cookie;
    let splitCookie = user_cookie.split('=');
    let id = socket.id

    const name = splitCookie[0];

    if(UnEnterable) {
        let log = {
            roomStatus : 0,
            turnIdx : 0,
            msg : [],
            play_log : [],
            user : [],
            time_log : {
                createTime : '',
                startTime : '',
                overTime : '',
                extinctTime : ''
            }
        };

        let roomName = firstRoomName+room.length;

        log.time_log.createTime = new Date();
        log.user.push({name, id});
        room[room.length] = log;
        socket.join(roomName);
        bingoRoom.to(roomName).emit('whosEnter', name, roomName, 1);
        UnEnterable = false;
    } else {
        let lastRoomIdx = room.length-1;

        room[lastRoomIdx].user.push({name, id});
        socket.join(firstRoomName+lastRoomIdx);
        bingoRoom.to(firstRoomName+lastRoomIdx).emit('whosEnter', name, firstRoomName+lastRoomIdx, room[lastRoomIdx].user.length);
        if(room[lastRoomIdx].user.length == 4){
            room[lastRoomIdx].roomStatus = 1;
            room[lastRoomIdx].time_log.startTime = new Date();
            bingoRoom.to(firstRoomName+lastRoomIdx).emit('GameStart', room[lastRoomIdx].user[0].name);
            bingoRoom.to(room[lastRoomIdx].user[room[lastRoomIdx].turnIdx].id).emit('UrTurn');
            UnEnterable = true;
        }
    };

    
    // message 발송 시 server에서 받음
    socket.on('send', function(data){
        
        let user_name = data.user_name,
            msg = data.msg,
            idx = data.roomIdx;
        
        let room_idx = idx.split('-');
        
        room[room_idx[1]].msg.push({user_name, msg})
        socket.broadcast.to(idx).emit('received', user_name, msg);
    });
    
    // 빙고 숫자 클릭 server에서 받음
    socket.on('CLICK', function(data){
        let idx = data.roomIdx,
            user_name = data.user_name,
            number = data.num;
        
        let room_idx = idx.split('-');
        
        room[room_idx[1]].turnIdx += 1;
        
        if(room[room_idx[1]].turnIdx == 4) room[room_idx[1]].turnIdx = 0;
        
        room[room_idx[1]].play_log.push({user_name, number});
        
        bingoRoom.to(idx).emit('CLICK', user_name, number, room[room_idx[1]].user[room[room_idx[1]].turnIdx].name);
        bingoRoom.to(room[room_idx[1]].user[room[room_idx[1]].turnIdx].id).emit('UrTurn');    
    });
    
    // 게임 종료
    socket.on('GAMEOVER', function(roomIdx){
        let room_idx = roomIdx.split('-');
        room[room_idx[1]].time_log.overTime = new Date();
        room[room_idx[1]].roomStatus = 2;
        
        bingoRoom.to(roomIdx).emit('GAMEOVER');
    });

    // server와 연결 해제
    socket.on('disconnect', function() {
            let idx = 0;
            room.forEach(function(items){
                if(items.roomStatus == 0){
                    items.user.forEach(function(item){
                        if(item.id == socket.id){
                            items.user.splice(items.user.indexOf(item), 1);
                            bingoRoom.to(firstRoomName+idx).emit('whosLeave', item.name, firstRoomName+idx, items.user.length);
                            socket.leave(firstRoomName+idx);
                            if(items.user.length == 0) items.time_log.extinctTime = new Date();
                        }
                    });
                }
                idx += 1;
            });

        console.log("User disconnected");
    });
});

server.listen(port, function(){
    console.log(`Express server has started on port ${port}`);
});